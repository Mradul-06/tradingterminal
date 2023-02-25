import React from "react";
import Form from "../form"
import axios from "axios";
import { Link, redirect, useNavigate } from "react-router-dom";
import './login.css';
const Login = () => {
  // axios.get("http://localhost:8080/fetch").then((resp) => console.log(resp));

  const navigate = useNavigate()
  const callLoginApi = (username, password,user_id) => {
    axios
      .post("http://127.0.0.1:5000/Login", {
        'username': username,
        'password': password,
        'user_id':user_id
      })
      .then((res) => redirectToProfile(res.data));
  };

  const redirectToProfile = (res) => {
    console.log(res)
    if(res === true){
      console.log("in condition")
      redirect('/');
      setTimeout(() => {
        console.log("setTimeout executed")
        navigate('/home')
      }, 1000)
    }
  }
  return (
    <div className="main-page">
      <Form submitLabel={"Login"} apiCallBack={callLoginApi} />
      <Link to='/Signup'><div className="redirect-button">Create an Account</div></Link>
    </div>
  );
};

export default Login;
