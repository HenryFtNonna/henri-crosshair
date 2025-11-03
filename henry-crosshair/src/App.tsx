// henry-crosshair/src/App.tsx
import React from "react";
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import MainPage from "./pages/MainPage" 
import AdminDashboard from "./pages/AdminDashboard"
import Navbar from "./components/layout/NavBar"
import { RequireAdmin } from "./components/RequireAuth"
import { AuthProvider } from "./context/AuthContext"
import BG from "./assets/images/cypher.jpg"



function App() {

  return (
    <>
    <img src={BG} className="fixed top-0 left-0 w-full h-full object-cover -z-10 blur-sm"/>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/admin" element={
            <RequireAdmin>
              <AdminDashboard/>
            </RequireAdmin>
          } 
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App
