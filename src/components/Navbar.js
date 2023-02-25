import React from 'react'
import {Link} from 'react-router-dom'
import "./Navbar.css"
// import axios from 'axios'

const Navbar = () => {


  return (
    <>
    <div className="Navbarnav-bar">
      <div className="Navbarhead">Trading Terminal</div>
        <ul className="Navbarnav" type='none'>
        <Link to="/home">
        <li className="Navbarnav-Item">
          <div className="Navbarnav-Link"  >
          Home
          </div>
          </li>
        </Link>
        <Link to="/profile">
        <li className="Navbarnav-Item">
          <div className="Navbarnav-link" >Profile</div>
        </li>
        </Link>
        <Link to="/orders">
        <li className="Navbarnav-Item">
          <div className="Navbarnav-link">Positions</div>
        </li>
        </Link>
        <Link to="/terminal">
        <li className="Navbarnav-Item">
          <div className="Navbarnav-link">Trade</div>
        </li>
        </Link>
        <li className="Navbarnav-Item">
         <a href='http://newzmarket.unaux.com/'> <div className="Navbarnav-link" >News</div></a>
        </li>
        
        </ul>


    </div>
    </>
  )
}

export default Navbar