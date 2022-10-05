import React from "react";
import Form from "../form";
import axios from "axios";

const Signup = () => {
  const apiCallBack = (username, password) => {
    axios
      .post("http://localhost:8080/insert", {
        user_id: username,
        user_pass: password,
      })
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <Form req={"login"} apiCallBack={apiCallBack} />
    </div>
  );
};

export default Signup;
