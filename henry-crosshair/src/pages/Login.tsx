import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function Login() {
  const { signIn, signInWithEmailLink } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'password') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/admin');
      } else {
        const { error } = await signInWithEmailLink(email);
        if (error) throw error;
        alert('Check your email for the login link!');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // className="min-h-screen flex flex-col   text-gray-900 px-6 py-6 pt-24"
    <div className="min-h-screen flex items-center justify-center bg-white/5 px-4 ">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm ">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 ">
          {mode === 'password' ? 'Sign in' : 'Login with Magic Link'}
        </h1>

        <form 
         onSubmit={handleLogin} 
         className="space-y-6"
         >
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          {mode === 'password' && (
            
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors ${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } transition`}
          >
            {loading
              ? 'Processing...'
              : mode === 'password'
              ? 'Sign In'
              : 'Send Magic Link'}
          </motion.button>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMsg}</p>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'password' ? (
            <>
              Prefer passwordless login?{' '}
              <button
                onClick={() => setMode('magic')}
                className="text-indigo-600 underline"
              >
                Use Magic Link
              </button>
            </>
          ) : (
            <>
              Back to{' '}
              <button
                onClick={() => setMode('password')}
                className="text-indigo-600 underline"
              >
                Password Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
