import time
import webbrowser
import urllib.request
import urllib.parse
from fyers_api import fyersModel
from fyers_api import accessToken
from urllib.parse import urlparse
from urllib.parse import parse_qs
from selenium import webdriver
import requests
import json

username='DM02346'
password='Mradul126$'
pin='6121'
secretKey='0NUYCSK0TU'
clientAppId='OZBA8GS48Q-100'
redirectUri='http://127.0.0.1:5000/login'
data={
    "fy_id": username,
    "password": password,
    "app_id": "2",
    "imei": "",
    "recaptcha_token": ""
}


def connect(username,password,pin,clientAppId,secretKey,redirectUri):
     
    session=accessToken.SessionModel(client_id=clientAppId,secret_key=secretKey,redirect_uri=redirectUri,response_type='code',state='Success',grant_type='authorization_code')
    response = session.generate_authcode()

    x=requests.post('https://api.fyers.in/vagator/v1/check_user_status',json={'fy_id':"DM02346",'app_id':"2"})
    y=requests.post('https://api.fyers.in/vagator/v1/login',json=data)
    parsedJson=json.loads(y.text)
    z=requests.post('https://api.fyers.in/vagator/v1/verify_pin',json=
                        {
                            'identifier': pin,
                            'identity_type': "pin",
                            'recaptcha_token': "",
                            'request_key': parsedJson['request_key'],
                        }
                    )   
    parsedJson=json.loads(z.text)
    refreshtoken = parsedJson['data']['refresh_token']
    accesstoken = parsedJson['data']['access_token']

    a=requests.post('https://api.fyers.in/api/v2/token',json=
                        {
                        "fyers_id": "DM02346",
                        "app_id": "OZBA8GS48Q",
                        "redirect_uri": "http://127.0.0.1:5000/login",
                        "appType": "100",
                        "code_challenge": "",
                        "state": "Success",
                        "scope": "",
                        "nonce": "",
                        "response_type": "code",
                        "create_cookie": 'true'
                        },
                        headers={"Authorization": f"Bearer {accesstoken}"}
                    )    
    parsedJson=json.loads(a.text)
    accessUrl=parsedJson['Url']
    auth=accessUrl.split("&")
    authcode=auth[2].split('=')
    auth_code=authcode[1]
    
    session.set_token(auth_code)
    resp = session.generate_token()
    accesstoken=resp['access_token']
    
    
    
    return accesstoken;
    
connect(username,password,pin,clientAppId,secretKey,redirectUri);



# # "You will be provided with the access_token wh21

 # fyers = fyersModel.FyersModel(client_id='OZBA8GS48Q-100', token=accessToken)
 # profile=fyers.get_profile()

# order=fyers.tradebook()

# data = {
#       "symbol":"NSE:SBIN-EQ",
#       "qty":1,
#       "type":2,
#       "side":1,
#       "productType":"INTRADAY",
#       "limitPrice":0,
#       "stopPrice":0,
#       "validity":"DAY",
#       "disclosedQty":0,
#       "offlineOrder":"False",
#       "stopLoss":0,
#       "takeProfit":0
#     }

# print(fyers.place_order(data))
# print(fyers.funds())

# # ----------------------------------------------------------------------------------------------------------------
# data = {"symbol":"NSE:SBIN-EQ","resolution":"30","date_format":"1","range_from":"2022-01-01","range_to":"2022-01-30","cont_flag":"1"}

# sbidata=fyers.history(data)


# -----------------------------------------------------------------------------------------------------------------------------------------
  


# is_async = True  #(By default the async will be False, Change to True for async API calls.)
