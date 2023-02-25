import React from 'react'
// import Navbar from './components/Navbar'
import Profile from './components/Profile'
import {Route,Routes,BrowserRouter} from "react-router-dom"
import Home from './components/Home'
import Orders  from './components/Orders'
import Terminal from './components/Terminal'
import Login from './components/Login/login'
import Signup from './components/Signup/signup'

const App = () => {
  return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}></Route>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/orders' element={<Orders/>}></Route>
            <Route path='/terminal' element={<Terminal/>}></Route>
            <Route path='/Login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
        </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App