# -*- coding: utf-8 -*-
"""
Created on Tue Feb  8 14:39:07 2022

@author: mradul
"""

from fyers import connect
from fyers_api import fyersModel
from flask import Flask
from flask_cors import CORS
from flask import request
import pandas as pd
import matplotlib.pyplot as plt
import datetime
import plotly.express as px
import numpy as np
import pymongo

username='DM02346'
password='Mradul126$'
pin='6121'
secretKey='0NUYCSK0TU'
clientAppId='OZBA8GS48Q-100'
redirectUri='http://127.0.0.1:5000/login'

app=Flask(__name__)
cors = CORS(app)
# Members api route



def connection():
    accesstkn=connect(username,password,pin,clientAppId,secretKey,redirectUri);
    global fyer 
    fyer = fyersModel.FyersModel(client_id=clientAppId,token=accesstkn);
    return fyer

#--------------------------------------------------
#database
#--------------------------------------------------
@app.route('/Signup',methods=['POST'])
def Signup():
    Name=request.json['username']
    Password=request.json['password']
    Id=request.json['user_id']
    
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["customers"]
    
    existing_user = mycol.find_one({'ID':Id})
    
    if existing_user is None:
        mydict = { "Name": Name, "Password": Password,'ID':Id }
        x = mycol.insert_one(mydict)
        return 'Signup success, Proceed to Login'
    else:
        return 'Username is Taken, Try Another One'
#--------------------------------------------------
@app.route('/Login',methods=['POST'])
def Login():
    Name=request.json['username']
    Password=request.json['password']
    Id=request.json['user_id']
    
    myclient = pymongo.MongoClient("mongodb://localhost:27017/")
    mydb = myclient["mydatabase"]
    mycol = mydb["customers"]
    
    login_user=mycol.find_one({'ID':Id})
    
    if  login_user:
        passKey=mycol.find({'ID':Id},{'Password':1,})
        x=list(passKey)
        pass_Key=(x[0])['Password']
        
        if pass_Key==Password:
            return 'true'
        else:
            return 'false'

#--------------------------------------------------

@app.route('/connection')
def connecting():
    connection();
    return 'success'

@app.route('/profile')
def Profile():
    profile=fyer.get_profile()
    return profile
    
@app.route('/funds')
def Funds():
    funds=fyer.funds()
    return funds

@app.route('/positions')
def positions():
    positions=fyer.positions()
    
    return positions

@app.route('/start')
def start():
    data = {"symbols":"NSE:SBIN-EQ"}
    temp=fyer.quotes(data)
    return temp

@app.route('/Buy',methods=['POST'])
def PlaceOrderBuy():
    qty=request.json['sendQty']
    instrument=request.json['sendInstrument']
    OrderData = {
      "symbol":instrument,
      "qty":qty,
      "type":2,
      "side":1,
      "productType":"INTRADAY",
      "limitPrice":0,
      "stopPrice":0,
      "validity":"DAY",
      "disclosedQty":0,
      "offlineOrder":"False",
      "stopLoss":0,
      "takeProfit":0
    }
    fyer.place_order(OrderData)
    return {'status':'Buy success','qty': qty, 'inst': instrument}

    
@app.route('/Sell',methods=['POST'])
def PlaceOrderSell():
    qty=request.json['sendQty']
    instrument=request.json['sendInstrument']
    OrderData = {
      "symbol":instrument,
      "qty":qty,
      "type":2,
      "side":-1,
      "productType":"INTRADAY",
      "limitPrice":0,
      "stopPrice":0,
      "validity":"DAY",
      "disclosedQty":0,
      "offlineOrder":"False",
      "stopLoss":0,
      "takeProfit":0
    }
    fyer.place_order(OrderData)    
    return {'status':'Sell success','qty': qty, 'inst': instrument}


@app.route('/CandleStickData',methods=["GET","POST"])
def CandlestickData():
    instrument=request.json['sendInstrument']
    rangeFrom=str(request.json['startTime'])
    rangeTo=str(request.json['endTime'])
    resolution=request.json['periodicity']
    print(instrument,rangeFrom,rangeTo,resolution)
    data = {
            "symbol":instrument,
            "resolution":resolution,
            "date_format":"0",
            "range_from":rangeFrom,
            "range_to":rangeTo,
            "cont_flag":"1"
            }
    temp=fyer.history(data);
    return temp

@app.route('/MovingAverageStrategy',methods=["GET","POST"])
def MovingAverageStrategy():
    instrument=request.json['sendInstrument']
    rangeFrom=str(request.json['startTime'])
    rangeTo=str(request.json['endTime'])
    resolution=request.json['periodicity']
    print(instrument,rangeFrom,rangeTo,resolution)
    data = {
            "symbol":instrument,
            "resolution":resolution,
            "date_format":"0",
            "range_from":rangeFrom,
            "range_to":rangeTo,
            "cont_flag":"1"
            }
    temp=fyer.history(data);
    df=pd.DataFrame(temp['candles']);
    df.columns=['time','open','high','low','close','volume']
    df['time']=pd.to_datetime(df['time'],unit='s',utc=True).map(lambda x: x.tz_convert('Asia/Kolkata'))
    
    fsma_period=9
    ssma_period=50
    
    df['slow_sma']=df['close'].rolling(ssma_period).mean()
    df['fast_sma']=df['close'].rolling(fsma_period).mean()
    df.dropna(inplace=True)
    
    
    #######################visulize close Price#########################
    
    ax=plt.gca();
    fig=df.plot(kind='line',x='time',y=['close','slow_sma','fast_sma'],grid=True)
    
    #############finding_crossover#########################
    
    df['prev_fast_sma'] = df['fast_sma'].shift(1)
    
    def find_crossover(fast_sma,prev_fast_sma,slow_sma):
        
        if fast_sma > slow_sma and prev_fast_sma < slow_sma:
            return 'bullish crossover'
        elif fast_sma < slow_sma and prev_fast_sma > slow_sma:
            return 'bearish crossover'
        return None
    
    
    df['crossover'] = np.vectorize(find_crossover)(df['fast_sma'],df['prev_fast_sma'],df['slow_sma'])
    
    signal=df[df['crossover'] == 'bullish crossover'].copy()
    
    ####################
    # creating backtest and position classes
    
    class Position:
        def __init__(self, open_datetime, open_price, order_type, volume, sl, tp):
            self.open_datetime = open_datetime
            self.open_price = open_price
            self.order_type = order_type
            self.volume = volume
            self.sl = sl
            self.tp = tp
            self.close_datetime = None
            self.close_price = None
            self.profit = None
            self.status = 'open'
            
        def close_position(self, close_datetime, close_price):
            self.close_datetime = close_datetime
            self.close_price = close_price
            self.profit = (self.close_price - self.open_price) * self.volume if self.order_type == 'buy' \
                                                                            else (self.open_price - self.close_price) * self.volume
            self.status = 'closed'
            
        def _asdict(self):
            return {
                'open_datetime': self.open_datetime,
                'open_price': self.open_price,
                'order_type': self.order_type,
                'volume': self.volume,
                'sl': self.sl,
                'tp': self.tp,
                'close_datetime': self.close_datetime,
                'close_price': self.close_price,
                'profit': self.profit,
                'status': self.status,
            }
            
            
    class Strategy:
        def __init__(self, df, starting_balance, volume):
            self.starting_balance = starting_balance
            self.volume = volume
            self.positions = []
            self.data = df
            
        def get_positions_df(self):
            df = pd.DataFrame([position._asdict() for position in self.positions])
            df['pnl'] = df['profit'].cumsum() + self.starting_balance
            return df
            
        def add_position(self, position):
            self.positions.append(position)
            
            return True
            
    # logic
        def run(self):
            for i, data in self.data.iterrows():
                
                if data.crossover == 'bearish crossover':
                    for position in self.positions:
                        if position.status == 'open':
                            position.close_position(data.time, data.close)
                
                if data.crossover == 'bullish crossover':
                    self.add_position(Position(data.time, data.close, 'buy', self.volume, 0, 0))
            
            return self.get_positions_df()
    
    # # -----------------------------------------------------------
    
    sma_crossover_strategy = Strategy(df, 10000, 10)
    result = sma_crossover_strategy.run()
    resp=result.to_json(orient='split')
    return resp
    


if __name__ == '__main__':
    app.run()








# symbol='NSE:SBIN-EQ'
# resolution='D'
# date_format='1'
# range_from:'2021-08-30'
# range_to:'2022-07-30'
# cont_flag:"1"



# data = {"symbol":'NSE:SBIN-EQ',"resolution":'1',"date_format":'1',"range_from":'2022-09-05',"range_to":'2022-09-06',"cont_flag":"1"}
# temp=fyer.history(data);
# df=pd.DataFrame(temp['candles']);
# df.columns=['time','open','high','low','close','volume']
# df['time']=pd.to_datetime(df['time'],unit='s',utc=True).map(lambda x: x.tz_convert('Asia/Kolkata'))

# fsma_period=9
# ssma_period=50

# df['slow_sma']=df['close'].rolling(ssma_period).mean()
# df['fast_sma']=df['close'].rolling(fsma_period).mean()
# df.dropna(inplace=True)


# #######################visulize close Price#########################

# ax=plt.gca();
# fig=df.plot(kind='line',x='time',y=['close','slow_sma','fast_sma'],grid=True)

# #############finding_crossover#########################

# df['prev_fast_sma'] = df['fast_sma'].shift(1)

# def find_crossover(fast_sma,prev_fast_sma,slow_sma):
    
#     if fast_sma > slow_sma and prev_fast_sma < slow_sma:
#         return 'bullish crossover'
#     elif fast_sma < slow_sma and prev_fast_sma > slow_sma:
#         return 'bearish crossover'
#     return None


# df['crossover'] = np.vectorize(find_crossover)(df['fast_sma'],df['prev_fast_sma'],df['slow_sma'])

# signal=df[df['crossover'] == 'bullish crossover'].copy()

# ####################
# # creating backtest and position classes

# class Position:
#     def __init__(self, open_datetime, open_price, order_type, volume, sl, tp):
#         self.open_datetime = open_datetime
#         self.open_price = open_price
#         self.order_type = order_type
#         self.volume = volume
#         self.sl = sl
#         self.tp = tp
#         self.close_datetime = None
#         self.close_price = None
#         self.profit = None
#         self.status = 'open'
        
#     def close_position(self, close_datetime, close_price):
#         self.close_datetime = close_datetime
#         self.close_price = close_price
#         self.profit = (self.close_price - self.open_price) * self.volume if self.order_type == 'buy' \
#                                                                         else (self.open_price - self.close_price) * self.volume
#         self.status = 'closed'
        
#     def _asdict(self):
#         return {
#             'open_datetime': self.open_datetime,
#             'open_price': self.open_price,
#             'order_type': self.order_type,
#             'volume': self.volume,
#             'sl': self.sl,
#             'tp': self.tp,
#             'close_datetime': self.close_datetime,
#             'close_price': self.close_price,
#             'profit': self.profit,
#             'status': self.status,
#         }
        
        
# class Strategy:
#     def __init__(self, df, starting_balance, volume):
#         self.starting_balance = starting_balance
#         self.volume = volume
#         self.positions = []
#         self.data = df
        
#     def get_positions_df(self):
#         df = pd.DataFrame([position._asdict() for position in self.positions])
#         df['pnl'] = df['profit'].cumsum() + self.starting_balance
#         return df
        
#     def add_position(self, position):
#         self.positions.append(position)
        
#         return True
        
# # logic
#     def run(self):
#         for i, data in self.data.iterrows():
            
#             if data.crossover == 'bearish crossover':
#                 for position in self.positions:
#                     if position.status == 'open':
#                         position.close_position(data.time, data.close)
            
#             if data.crossover == 'bullish crossover':
#                 self.add_position(Position(data.time, data.close, 'buy', self.volume, 0, 0))
        
#         return self.get_positions_df()

# # # -----------------------------------------------------------

# sma_crossover_strategy = Strategy(df, 10000, 10)
# result = sma_crossover_strategy.run()


# # ------------------------------
# result.plot(kind='line',x='close_datetime',y='pnl',grid=True)




# ---------------------------------------------###################################################################----------------------------------------------------------
# Access_token = “The access token here being sent will be in the following structure (i.e) app_id:access_token”

#    data_type = “symbolData”  (for symbol websocket the data_type has to be “symbolData”)

#    run_background  = False (by default) If you don’t want to get the orderUpdate over the console you can set the run_background to True

#   symbol= [”NSE:SBIN-EQ”,”NSE:ONGC-EQ”]

#  (This is the custom message function which we need to have in order to receive the Symbol/order update and accordingly you can manipulate the data you receive through this function  )
#  def custom_message(msg):
#      print (f"Custom:{msg}")    

#  ws.websocket_data = custom_message

#  fyersSocket = ws.FyersSocket(access_token=access_token,run_background=False,log_path=’home/Documents”)
#  fyersSocket.subscribe(symbol=symbol,data_type=data_type)

#  If run_background Process is set to True. Then while running the orderUpdate over  the logs you can also be able to call the other calls too in the following manner 

#  fyersSocket.subscribe(symbol=symbol,data_type=data_type)
#  print(fyers.get_profile())
#  print(fyers.tradebook())
#  print(fyers.positions())
#  fs.keep_running()  {This is used in order to keep your Websocket Thread Open and also do the remaining functionality as expected or other method calls}


#   ------------------------------------------------------------------------------------------------------------------------------------------
#  Sample Success Response 
#  ------------------------------------------------------------------------------------------------------------------------------------------
           
#   {‘symbol’:”NSE:SBIN-EQ”, 'timestamp': 1619690695, 'fyCode': 7208, 'fyFlag': 2, 'pktLen': 200, 'ltp': 69484.0, 'open_price': 69320.0, 'high_price': 69950.0, 'low_price': 69320.0, 'close_price': 69103.0, 'min_open_price': 69478.0, 'min_high_price': 69492.0, 'min_low_price': 69478.0, 'min_close_price': 69484.0, 'min_volume': 67, 'last_traded_qty': 1, 'last_traded_time': 1619690693, 'avg_trade_price': 6968517, 'vol_traded_today': 46144, 'tot_buy_qty': 5645, 'tot_sell_qty': 8058, 'market_pic': [{'price': 69481.0, 'qty': 1, 'num_orders': 1}, {'price': 69480.0, 'qty': 2, 'num_orders': 1}, {'price': 69478.0, 'qty': 3, 'num_orders': 1}, {'price': 69477.0, 'qty': 4, 'num_orders': 1}, {'price': 69476.0, 'qty': 5, 'num_orders': 5}, {'price': 69492.0, 'qty': 4, 'num_orders': 3}, {'price': 69493.0, 'qty': 2, 'num_orders': 1}, {'price': 69494.0, 'qty': 6, 'num_orders': 3}, {'price': 69495.0, 'qty': 3, 'num_orders': 1}, {'price': 69497.0, 'qty': 2, 'num_orders': 2}]}

