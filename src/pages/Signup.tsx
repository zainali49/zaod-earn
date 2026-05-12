import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { generateReferralCode } from '../lib/utils';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, Lock, User, Users } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user'|'advertiser'>('user');
  const [referral, setReferral] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUserData = {
        uid: userCred.user.uid,
        email,
        role,
        balance: 0,
        completedTasks: 0,
        dailyTasksDone: 0,
        lastTaskDate: new Date().toISOString().split('T')[0],
        referralCode: generateReferralCode(),
        referredBy: referral || null,
        plan: 'Free',
        isBlocked: false,
        createdAt: Date.now()
      };

      await setDoc(doc(db, 'users', userCred.user.uid), newUserData);
      // Wait for AuthGuard
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col relative px-6 py-12 overflow-y-auto">
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
      
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center z-10 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join Earnexa and start earning today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div 
                onClick={() => setRole('user')}
                className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${role === 'user' ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 opacity-60'}`}
              >
                <div className="text-sm font-medium">Earner</div>
              </div>
              <div 
                onClick={() => setRole('advertiser')}
                className={`p-4 rounded-2xl border cursor-pointer text-center transition-all ${role === 'advertiser' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 opacity-60'}`}
              >
                <div className="text-sm font-medium">Advertiser</div>
              </div>
            </div>

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
                placeholder="Password (min. 6 chars)"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                type="text"
                placeholder="Referral Code (Optional)"
                icon={<Users size={20} />}
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" className="w-full mt-8" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-gray-400 mt-8 text-sm pb-8">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-white font-medium hover:underline">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
