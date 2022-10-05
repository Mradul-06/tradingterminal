import React from "react";
import Form from "../form"
import axios from "axios";

const Login = () => {
  // axios.get("http://localhost:8080/fetch").then((resp) => console.log(resp));

  const callLoginApi = (username, password) => {
    axios
      .get("http://localhost:8080/verify", {
        user_id: username,
        user_pass: password,
      })
      .then((resp) => console.log(resp.data));
  };

  return (
    <div>
      <Form req={"login"} apiCallBack={callLoginApi} />
    </div>
  );
};

export default Login;
