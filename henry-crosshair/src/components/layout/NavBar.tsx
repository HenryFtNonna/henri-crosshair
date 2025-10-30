import React from 'react';
import { motion } from 'motion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (user) {
      // kalo udah login → logout
      await signOut();
      navigate('/');
    } else {
      // kalo belum login → ke /login
      navigate('/login');
    }
  };

  return (
    <div className="fixed navbar bg-gray-100 w-full px-8 py-4 flex justify-end drop-shadow-2xl">
      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        className={`btn flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition`}
      >
        {user ? (
          <>
            <span>Logout</span>
            {/* <FontAwesomeIcon icon={faRightFromBracket} /> */}
          </>
        ) : (
          <>
            <span>Login</span>
            {/* <FontAwesomeIcon icon={faArrowRight} /> */}
          </>
        )}
      </motion.button>
    </div>
  );
}
