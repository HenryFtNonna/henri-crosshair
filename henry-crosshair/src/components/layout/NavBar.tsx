import React, { use } from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const {user, signOut} = useAuth();

  return (
    <div className="fixed navbar bg-gray-100 w-full px-8 py-4 flex justify-end drop-shadow-2xl">
      
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="btn bg-blue-600 text-xl text-white rounded-e-lg"
      >
        {/* Login  */}
        <Link to={"/Login"}><FontAwesomeIcon icon={faArrowRight}/></Link>
      </motion.button>
    </div>
  );
}
