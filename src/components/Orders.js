import React from 'react'
import Navbar from './Navbar'
import axios from 'axios';

function Orders() {
  const url="http://127.0.0.1:5000/positions";
  axios.get(url).then((response)=>{
    console.log(response.data)
  })

  
  return (
    <div>
        <Navbar/>
        Positions
    </div>
  )
}

export default Orders