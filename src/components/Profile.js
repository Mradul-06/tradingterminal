import React from 'react'
import Navbar from './Navbar';
import {useLayoutEffect, useState} from 'react'
import axios from 'axios';
import './profile.css'


function Profile() {
  const [data, setData] = useState();
  const [fundsData, setFundsData] = useState();

  useLayoutEffect(() => {
    const url="http://127.0.0.1:5000/profile";

    axios.get(url).then((response) => {
       setData(response.data);
    })

    const url2="http://127.0.0.1:5000/funds";

    axios.get(url2).then((response) => {
      setFundsData(response.data);
      // console.log(response.data);
    })
  },[])

  const mapping = {
    email_id: "Email",
    fy_id: "Fyers - ID",
    name: "Name"
  }

  const getProfileUI = (data) => {

    const mappedObjects = Object.keys(data).map((item) => {
      if(mapping[item]){
        return(
            <div className="profile-list-item">
              <div className="profile-question">{mapping[item]}</div>
              <div className='profile-answer'>{data[item]}</div>
            </div>  
        )
      }else{
        return null;
      }
    }
    ) 

    return(
    <div className='profile-personal-div'>
      <div className='profile-header'>Personal Information</div>
     {mappedObjects}
    </div>
    ) 
    
  }

  const getFundsUI = (data) => {
    const mappedObjects = data.map((item) => {
      return(
        <div className="profile-list-item">
              <div className="profile-question-fund">{item.title}</div>
              <div className='profile-answer'>{item.equityAmount}</div>
            </div> 
      )
    })

    return(
      <div className='profile-personal-div'>
        <div className='profile-header'>Fund Information</div>
       {mappedObjects}
      </div>
    )
  }

  return(
      <div>
          <Navbar />
          {data && getProfileUI(data?.data)}
          {fundsData && getFundsUI(fundsData?.fund_limit)}
      </div>
    )
  }
export default Profile