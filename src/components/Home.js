import React, { useState } from 'react'
// import { Link } from "react-router-dom";
import Navbar from './Navbar'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import './home.css'

const Home = () => {
  const[status,setStatus]=useState("")
  const connect = () =>{
    axios.get("http://127.0.0.1:5000/connection").then((res)=>(setStatus(res.data)))
  }
  return (
    <div >
      <Navbar/>
      <hr className='hr'></hr>
      <div className='body-container'>
      <div className='heading-container'>
        <h1>
          Trading Terminal
        </h1>
      </div>
      
      <div className='text-container'> 
        <h2>
          Click on connect to connect to Broker
        </h2>
      </div>
      <div className='text-container'>
      <h5>{status}</h5>
      </div>
     
      <div className='btn-container'>
      <Button variant="success" onClick={connect}>Connect</Button>
        </div>
        
        </div>
        </div>
)};

export default Home;