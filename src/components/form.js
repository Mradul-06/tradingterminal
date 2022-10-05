import React, { useState } from "react";
// import axios from "axios";

const Form = ({ req, apiCallBack }) => {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    apiCallBack(username, password);
  };

  return (
    <div>
      <form>
        <div className="input-container">
          <label>Username </label>
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
          <label>Password </label>
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
        <div className="button-container">
          <input type="submit" onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
};

export default Form;
