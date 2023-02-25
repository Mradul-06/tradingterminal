import React, { useState } from "react";
// import axios from "axios";
import './form.css'

const Form = ({ submitLabel, apiCallBack }) => {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [user_id,setUserid] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCallBack(username, password,user_id);
  };

  return (<>
    <div className="heading-container"><h1>Trading Terminal</h1></div>
    <div className="main-div">
       
        
     <div className="form-container">
      <form>
      <div className="input-container">
        <div className="label-container">
          User-ID
        </div>
          <input
            type="text"
            name="userid"
            value={user_id}
            required
            onChange={(e) => {
              setUserid(e.target.value);
            }}
          />
        </div>
        <div className="input-container">
        <div className="label-container">
          Username
        </div>
          <input
            type="text"
            name="uname"
            value={username}
            required
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
        </div>
        <div className="input-container">
        <div className="label-container">
          Password
        </div>
          <input
            type="password"
            name="pass"
            value={password}
            required
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </div>
        <div className="button-container" onClick={handleSubmit}>
            <span className="button">
                 {submitLabel}
            </span>
        </div>
      </form>
    </div>
    </div>
    </>
  );
};

export default Form;
