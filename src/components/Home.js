import React from 'react'
import { Link } from "react-router-dom";
import Navbar from './Navbar'



const Home = () => {
  return (
    <div>
      <Navbar/>
      <div>
        <Link to="/Login">Login</Link>
      </div>
      <div>
        <Link to="/Signup">Signup</Link>
      </div>
    </div>
  );
};

export default Home;