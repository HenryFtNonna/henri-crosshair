import React from "react";
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import MainPage from "./pages/MainPage" 
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/layout/NavBar"
import { RequireAdmin } from "./components/RequireAuth"
import { AuthProvider } from "./context/AuthContext"


function App() {

  return (
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminDashboard/>
            </RequireAdmin>
          } 
          />
        </Routes>
      </AuthProvider>

  );
}

export default App
