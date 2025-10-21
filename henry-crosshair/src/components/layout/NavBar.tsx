import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <div className="fixed navbar bg-gray-100 w-full px-8 py-4 flex justify-end drop-shadow-2xl">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="btn bg-blue-600 text-xl text-white"
      >
        Login <FontAwesomeIcon icon={faArrowRight} className="ml-0" /> 
      </motion.button>
    </div>
  );
}
