import React from 'react'
import Navbar from '../components/layout/NavBar'
import {motion} from 'motion/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";


export default function AdminDashboard() {
  return (
    <div>
      
      <section className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900 px-8 py-2">
        {/* <Navbar/> */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-circle bg-blue-600 btn-xl border-0 btn-outline">
          <FontAwesomeIcon icon={faGear} className="text-xl" />
          
        </motion.button>
      </section>
    </div>
  )
}
