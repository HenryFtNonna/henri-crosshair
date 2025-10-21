import React from 'react'
import Navbar from '../components/layout/NavBar'
import {motion} from 'motion/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function AdminDashboard() {
  return (
    <div>
      <Navbar/>
        <section className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-900">

          {/* Tombol tambah sejajar dengan navbar */}
          <div className=" fixed bottom-6 w-full flex justify-end px-8">
            <motion.button
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-circle btn-lg bg-blue-600 border-0 shadow-lg"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[20px] text-white" />
            </motion.button>
          </div>
        </section>
    </div>
  )
}
