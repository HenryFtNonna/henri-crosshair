import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    console.log("Trying to login with:", email, password);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    navigate('/admin');
  };
  




  return (
        <div>
        {/* component */}
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Sign In
            </h2>
            <form className="space-y-5" onSubmit={handleLogin}> 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <motion.input
                  whileTap={{ scale: 1.5 }}
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <motion.input
                  whileTap={{ scale: 1.5 }}
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div> */}
              <motion.button 
                type='submit'
                whileTap={{ scale: 1.05 }}
                className="w-full btn bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-5.5">
                {loading ? 'Signing In...' : 'Sign in'}
              </motion.button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              © 2025 Mohan Henry Kusuma all rights reserved.
              {/* <a
                href="#"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign up
              </a> */}
            </div>
          </div>
        </div>
    </div>
  )
}
