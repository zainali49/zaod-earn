import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Wait for AuthGuard to pick it up and redirect
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col relative px-6 py-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]" />
      
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue earning.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
            
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                icon={<Mail size={20} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end pt-2">
              <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot Password?
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full mt-6" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-8 text-sm">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-white font-medium hover:underline">
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
