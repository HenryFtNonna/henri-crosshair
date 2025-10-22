import React from "react"
import { Route, Routes } from "react-router"

import Login from "./pages/Login"
import MainPage from "./pages/MainPage" 
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/layout/NavBar"

function App() {

  return (

      <div>
        <Navbar/>
        <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
        </div>

      </div>

  )
}

export default App
