import React from 'react'
import {Link} from 'react-router-dom'
import "./Navbar.css"
import axios from 'axios'

const Navbar = () => {

const connect = () =>{
  axios.get("http://127.0.0.1:5000/connection")
}

  return (
    <>
    <div className="navbar">
      <div className="head">Trading Terminal</div>
        <ul className="nav" type='none'>
        <Link to="/">
        <li className="nav-item">
          <div className="nav-link" aria-current="page" >
          Home
          </div>
          </li>
        </Link>
        <Link to="/profile">
        <li className="nav-item">
          <div className="nav-link" >Profile</div>
        </li>
        </Link>
        <Link to="/orders">
        <li className="nav-item">
          <div className="nav-link">Orders</div>
        </li>
        </Link>
        <Link to="/terminal">
        <li className="nav-item">
          <div className="nav-link">Trade</div>
        </li>
        </Link>
        </ul>
        <div className='nav-right'>
        <button className="btn" type="submit" onClick={connect}>Connect</button>
        </div>

    </div>
    </>
  )
}

export default Navbar