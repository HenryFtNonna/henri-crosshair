import React from 'react';
import {motion} from 'motion/react';

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 bg-gray-50 text-white drop-shadow-md z-50 ">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide"></h1>

        {/* Menu */}
        <ul className="hidden md:flex gap-8 text-lg">
          <li>
            <motion.button
            whileHover={{ scale: 1.1}}
            whileTap={{ scale: 0.95}}
            onHoverStart={() => console.log('hover started!')}
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-400 dark:focus:ring-gray-200">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </motion.button>
          </li>
        </ul>

      </div>
    </nav>
  );
}
