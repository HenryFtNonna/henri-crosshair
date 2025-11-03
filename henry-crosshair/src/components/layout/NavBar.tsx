import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (user) {
      await signOut();
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="fixed navbar bg-gray-100/30 w-full px-6 py-4 flex justify-between drop-shadow-3xl z-50">
      <p className='flex flex-col justify-items-start text-2xl font-mono font-bold'>Valorant Pros Crosshair</p> 
      {/* <img src={TextLogo} style={{width: 400}}/> */}
      {!loading && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={handleClick}
          className="btn flex items-end justify-end gap-2 bg-blue-800 text-white px-4 py-2 rounded-r-lg font-medium hover:bg-blue-900 transition"
        >
          <span>{user ? 'Logout' : 'Login'}</span>
        </motion.button>
      )}
    </div>
  );
}
