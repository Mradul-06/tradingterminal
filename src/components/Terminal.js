import React from 'react'
import {useState} from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import {createChart} from 'lightweight-charts'
import './terminal.css'

function Terminal() {

    const [instrument, setInstrument] = useState("NSE:SBIN-EQ")
    const [qty, setQty] = useState(0)

    const renderChart = (candlesData) => {
      const chartContainer = document.getElementsByClassName('chartContainer')[0];
      const chartObject = createChart(chartContainer, { width: 1000, height: 400, timeScale: {timeVisible: true, secondsVisible: false}});
      const candlestickSeries = chartObject.addCandlestickSeries();
      console.log(chartObject.timeScaleOptions)
      
      candlestickSeries.setData(candlesData)
    }

    const Buy = (event) =>{
        event.preventDefault()
        axios.post("http://127.0.0.1:5000/Buy", {
        "sendInstrument": instrument,
        "sendQty": qty
      })
      .then((response) => {
        console.log(response.data);
      });

    };

    const Sell = (event)=>{
      event.preventDefault()
      axios.post("http://127.0.0.1:5000/Sell", {
        "sendInstrument": instrument,
        "sendQty": qty
      })
      .then((response) => {
        console.log(response.data);
      });
    };

    const getCandlesData = () => {
      const url="http://127.0.0.1:5000/CandleStickData";

      const date = dayjs();
      dayjs.extend(timezone);
      dayjs.extend(utc);
      const endTime = date.unix();
      const startTime = date.subtract(1, 'week').unix();
      const periodicity = 5;

      axios.post(url,{"sendInstrument": instrument, "startTime" : startTime, "endTime" : endTime, "periodicity" : periodicity}).then((response) => {
        let formattedData=response.data.candles.map( ([time, open, high , low, close]) => {
          const zonedTime = dayjs(time).tz("Asia/Kolkata", true).valueOf();
          return (
          {"time": zonedTime, open, high, low, close}
          )
        })
        console.log(formattedData);
        renderChart(formattedData);
      });
    }


  const getLeftSideUI = () => {
    return (
    <div className='leftSideUI'>

      <div className="leftSideOptions">
      <div>Select Symbol</div>

      <select defaultValue="instrument" onChange={(e)=>(setInstrument(e.target.value))}>
      <option value="NSE:SBIN-EQ">SBI</option>
      <option value="NSE:RELIANCE-EQ">RELIANCE</option>
      <option value="NSE:HDFC-EQ">HDFC</option>
      <option value="NSE:IDEA-EQ">IDEA</option>
      <option value="NSE:TATAMOTORS-EQ">TATA MOTORS</option>
      </select>

     <div className="terminal-button" onClick={getCandlesData}>Generate Chart</div>
     </div>

    <div className="chartContainer"></div>
    </div>
    )
  }

  const getRightSideUI = () => {
    return (
    <div className='rightSideUI'>
      <div className='card'>
        <div className='terminal-text'>Please Enter Buy/Sell Qty for {instrument}</div>
        <div className='terminal-input'>
        <input type="number" name="qty" onBlur={(e)=>setQty(e.target.value)}></input>

        </div>

        <div className='terminal-tradeCta'> 
        <div className='terminal-button buy' onClick={Buy}>Buy  </div>
        <div className='terminal-button sell' onClick={Sell}>Sell </div>
        </div>
      </div>
     </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className='terminalHeader'>Trade Terminal</div>
    <div className='mainContainer'>
    {getLeftSideUI()}
    {getRightSideUI()}
    </div>
   
    {/* {!(candlesData.length === 0) && <Chart candlesData={candlesData}/>} */}
    </>
  )
}

export default Terminal