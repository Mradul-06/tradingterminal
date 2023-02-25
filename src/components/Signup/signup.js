import React from "react";
import Form from "../form";
import axios from "axios";
import { Link } from "react-router-dom";

import './signup.css'

const Signup = () => {
  const apiCallBack = (username, password,user_id) => {
    axios
      .post("http://127.0.0.1:5000/Signup", {
        'username': username,
        'password': password,
        'user_id':user_id
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div className="main-page">
      <Form submitLabel={"Signup"} apiCallBack={apiCallBack} />
      <Link to='/Login'><div className="redirect-button">Already have an Account, Login</div></Link>
    </div>
  );
};

export default Signup;
