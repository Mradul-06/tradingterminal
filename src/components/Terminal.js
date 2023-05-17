import React, { useState, useEffect, useLayoutEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { createChart } from 'lightweight-charts'
import './terminal.css'
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import io from 'socket.io-client';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import InfiniteScroll from 'react-infinite-scroll-component';
import Button from 'react-bootstrap/Button';



function Terminal() {

  const [instrument, setInstrument] = useState("NSE:BALKRISHNA-EQ")
  const [qty, setQty] = useState(0)
  const [interval, setInterval] = useState(5)
  const [orderData, setOrderData] = useState({})
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orderType, setOrderType] = useState('')
  const [productType, setProductType] = useState('')
  const [tickerPrices, setTickerPrices] = useState('')
  const [symbolList, setSymbolList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    console.log(orderQuantity)
    console.log(orderType)
    console.log(productType)

  }, [productType, orderType, orderQuantity])

  const socket = io.connect('http://localhost:5000');



  // useEffect(() => {
  //   console.log('initiating Connection')

  // }, [])


  socket.on('connect', (data) => {
    console.log('Connected')
  })

  useEffect(() => {
    console.log(tickerPrices)
  }, [tickerPrices])

  socket.on('ticker_feed', (data) => {
    console.log('ticker_feed fired')
    setTickerPrices(data.data?.d[0]?.v?.lp)
    console.log(data.data.d[0].v.lp)
  })

  // socket.emit('message', { 'a': 'b' }, (data) => {
  //   console.log('This is in Message')
  //   console.log(data)
  // })


  // if (document.getElementById('chartContainer')) {
  //   document.getElementById('chartContainer').remove()
  // }


  useEffect(() => {
    getCandlesData();
  }, [interval])

  const renderChart = (candlesData) => {
    const el = document.getElementById('chartContainer')
    if (el.firstChild) {
      el?.removeChild(el?.firstChild)
    }
    const chartContainer = document.getElementById('chartContainer');
    const chartObject = createChart(chartContainer, {
      width: 1500, height: 400, timeScale: { timeVisible: true, secondsVisible: false }
    });
    const candlestickSeries = chartObject.addCandlestickSeries();
    console.log(chartObject.timeScaleOptions)
    candlestickSeries.setData(candlesData)
  }

  const getOrders = () => {
    const url = "http://127.0.0.1:5000/orderbook";

    axios.get(url).then((response) => {
      setOrderData(response.data.orderBook);
      console.log(response.data.orderBook)
    })
  }

  const getSignalMovingAverage = () => {
    const url = "http://127.0.0.1:5000/movingAverage";

    axios.get(url).then((response) => {
      console.log(response.data)
    })
  }

  useLayoutEffect(() => {
    getOrders();
  }, [])



  // const Buy = (event) => {
  //   event.preventDefault()
  //   axios.post("http://127.0.0.1:5000/Buy", {
  //     "sendInstrument": instrument,
  //     "sendQty": qty
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //     });

  // };

  // const Sell = (event) => {
  //   event.preventDefault()
  //   axios.post("http://127.0.0.1:5000/Sell", {
  //     "sendInstrument": instrument,
  //     "sendQty": qty
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //     });
  // };

  const getCandlesData = () => {
    const url = "http://127.0.0.1:5000/CandleStickData";

    const date = dayjs();
    dayjs.extend(timezone);
    dayjs.extend(utc);
    const endTime = date.unix();
    const startTime = date.subtract(1, 'week').unix();
    const periodicity = interval;

    axios.post(url, { "sendInstrument": instrument, "startTime": startTime, "endTime": endTime, "periodicity": periodicity }).then((response) => {
      let formattedData = response.data.candles.map(([time, open, high, low, close]) => {
        const zonedTime = dayjs(time).tz("Asia/Kolkata", true).valueOf();
        return (
          { "time": zonedTime, open, high, low, close }
        )
      })
      console.log(formattedData);
      renderChart(formattedData);
    });
  }


  const getTickerList = () => {
    const url = "http://127.0.0.1:5000/tickerData";
    axios.post(url, { page: page, per_page: 10 }).then((response) => {
      console.log(response.data.items)
      setSymbolList(response.data.items)
      if (response.data.items.length > 0) {
        // Concatenate the new data with the existing data
        setSymbolList([...symbolList, ...response.data.items]);
        // Update the page number
        setPage(page + 1);
      } else {
        // If there is no more data to be loaded, set hasMoreData to false
        setHasMoreData(false);
      }


    })
  }

  const placeBuyOrder = () => {
    console.log('buy')
    axios.post("http://127.0.0.1:5000/placeOrder", {
      "sendInstrument": instrument,
      "sendQty": qty,
      'side': 1
    })
      .then((response) => {
        console.log(response.data);
      });

  }
  const placeSellOrder = () => {
    console.log('sell')
    axios.post("http://127.0.0.1:5000/placeOrder", {
      "sendInstrument": instrument,
      "sendQty": qty,
      'side': -1
    })
      .then((response) => {
        console.log(response.data);
      });

  }


  useEffect(() => {
    getTickerList();
  }, [])
  console.log({ symbolList })
  return (
    <>
      <Navbar />
      <div className='terminalHeader'><h1>Trade Terminal</h1></div>
      <div className='mainComponent'>
        <div className='leftComponent'>
          <div className='chartHeader'>
            <div className='dropDownContainer'>
              <Dropdown aria-expanded='true'>
                <Dropdown.Toggle variant="outline" id="dropdown-basic" size='md'>
                  {interval}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setInterval(1)} >3 min</Dropdown.Item>
                  <Dropdown.Item onClick={() => setInterval(5)} >5 min</Dropdown.Item>
                  <Dropdown.Item onClick={() => setInterval(15)} >15 min</Dropdown.Item>
                  <Dropdown.Item onClick={() => setInterval(30)} >30 min</Dropdown.Item>
                  <Dropdown.Item onClick={() => setInterval('1D')} >1D</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>


            <div className="instrumentNameHeader">
              {instrument}
            </div>
            <div className='signalContainer'>

            </div>
          </div>
          <div id='chartContainer' className='chartContainer'>
          </div>
          <div className='orderbookContainer'>
            <Tabs
              defaultActiveKey="profile"
              id="fill-tab-example"
              className="mb-3"
              onSelect={(eventKey) => {
                if (eventKey === 'Orderbook') {
                  getOrders();
                }
              }}
            >
              <Tab eventKey="Order" title="Order">
                <div className='orderCard'>
                  <InputGroup className="mb-3">
                    <InputGroup.Text value={orderQuantity} id="basic-addon1">Qty</InputGroup.Text>
                    <Form.Control
                      placeholder="Quantity "
                      aria-label="Username"
                      aria-describedby="basic-addon1"
                      onChange={(ev) => {
                        console.log(ev.target.value)
                        setQty(ev.target.value)
                      }}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Form.Select defaultValue={'2'} onChange={(ev) => { setOrderType(ev.target.value) }} aria-label="Default select example">
                      <option>Select Order Type</option>
                      <option value="1">Limit</option>
                      <option value="2">Market</option>
                      <option value="3">Stop Order(SL-M)</option>
                      <option value="4">StopLimit Order(SL-L)</option>
                    </Form.Select>
                  </InputGroup>
                  <InputGroup>
                    <Form.Select defaultValue={'CNC'} onChange={(ev) => { setProductType(ev.target.value) }} aria-label="Default select example">
                      <option>Select Product Type</option>
                      <option value="CNC">CNC</option>
                      <option value="INTRADAY">INTRADAY</option>
                    </Form.Select>
                  </InputGroup>

                  {orderType === '1' || orderType === '4' ?
                    <InputGroup className="mb-3">
                      <InputGroup.Text value={orderQuantity} onChange={(ev) => { setOrderQuantity(ev) }} id="basic-addon1">Price</InputGroup.Text>
                      <Form.Control
                        placeholder={orderType === '4' ? 'Enter StopLoss Price' : "Price"}
                        aria-label={orderType === '4' ? 'Enter StopLoss Price' : "Price"}
                        aria-describedby="basic-addon1"
                      />
                    </InputGroup>
                    : null}
                  <div className='btn-cont'>
                    <div className='btn'>
                      <Button variant="success" onClick={() => placeBuyOrder()}>Buy</Button>{' '}
                    </div>
                    <div className='btn'>
                      <Button variant="danger" onClick={() => placeSellOrder()}>Sell</Button>{' '}
                    </div>

                  </div>


                </div>
              </Tab>
              <Tab eventKey="Orderbook" title="Orderbook">
                {console.log(orderData.orderBook)}
              </Tab>
              <Tab eventKey="Positions" title="Positions">
              </Tab>
            </Tabs>
          </div>
        </div>
        <div className='rightComponent'>
          <ListGroup
            id={'scrollable-list-group'}
            style={{ height: '500px', overflow: 'auto' }}

          >
            <InfiniteScroll
              scrollableTarget="scrollable-list-group"
              dataLength={symbolList.length}
              next={() => {
                // Fetch the next set of data and update the symbolList state
                getTickerList();
              }}
              hasMore={hasMoreData}
              loader={<h4>Loading...</h4>}
              endMessage={<h4>No more items to load</h4>}
            >
              {symbolList.map((item) => {
                return (
                  <ListGroup.Item key={item.Ticker} onClick={() => {
                    setInstrument(item.Ticker);
                    getCandlesData();
                  }}>
                    <div className='listItem'>
                      <div>{item?.Symbol}</div>
                      <div>{item.Ticker}</div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </InfiniteScroll>

            {/* {symbolList && symbolList.map((item) => {
              return (
                <ListGroup.Item onClick={() => {
                  setInstrument(item.Ticker)
                  getCandlesData();
                }} >
                  <div className='listItem'>
                    <div>{item?.Symbol}  </div>
                    <div>{item.Ticker}</div>
                  </div >
                </ListGroup.Item>

              )
            })} */}
          </ListGroup>
        </div>
      </div >

    </>
  )


}

export default Terminal