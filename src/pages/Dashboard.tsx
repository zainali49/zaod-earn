import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/card';
import { PlayCircle, ArrowUpRight, Users, Zap, Bell, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { userData } = useAuthStore();
  const navigate = useNavigate();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeMessage(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const totalDailyTasks = userData?.plan === 'VIP' ? 'â' : userData?.plan === 'Premium' ? 400 : userData?.plan === 'Pro' ? 200 : userData?.plan === 'Starter' ? 100 : 50;

  const quickActions = [
    { name: 'Watch Ads', icon: PlayCircle, path: '/tasks', color: 'from-blue-500 to-cyan-500' },
    { name: 'Withdraw', icon: ArrowUpRight, path: '/withdraw', color: 'from-purple-500 to-pink-500' },
    { name: 'Referrals', icon: Users, path: '/referrals', color: 'from-emerald-500 to-teal-500' },
    { name: 'Upgrade', icon: Zap, path: '/settings', color: 'from-orange-500 to-amber-500' },
  ];

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <p className="text-gray-400 text-sm">Welcome back,</p>
          <h2 className="text-xl font-bold text-white truncate w-48">{userData?.email?.split('@')[0]}</h2>
        </div>
        <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center relative cursor-pointer">
          <Bell size={20} className="text-gray-300" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border border-[#0b1120]" />
        </div>
      </div>

      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center gap-3"
          >
            <CheckCircle className="text-blue-400" size={20} />
            <span className="text-sm text-blue-200">Ready to earn? Start watching ads!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Balance Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6 bg-gradient-to-br from-[#1a233a] to-[#0f172a] border-white/5 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-purple-500/20 rounded-full blur-[40px]" />
          <div className="p-6 relative z-10">
            <p className="text-gray-400 text-sm mb-1">Current Balance</p>
            <div className="flex items-end gap-2 mb-6">
              <h1 className="text-5xl font-bold text-white">
                <span className="text-2xl text-blue-400 mr-1">$</span>
                {userData?.balance?.toFixed(4) || "0.0000"}
              </h1>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-3 rounded-xl">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Today's Tasks</p>
                <div className="flex justify-between items-end">
                  <span className="font-semibold">{userData?.dailyTasksDone || 0} / {totalDailyTasks}</span>
                  <span className="text-xs text-blue-400">Ads</span>
                </div>
              </div>
              <div className="glass-panel p-3 rounded-xl">
                <p className="text-gray-400 text-[10px] uppercase tracking-wider mb-1">Current Plan</p>
                <div className="flex justify-between items-end">
                  <span className="font-semibold text-purple-400">{userData?.plan || 'Free'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <h3 className="text-lg font-semibold mb-4 px-1">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-3 mb-8">
        {quickActions.map((action, idx) => (
          <motion.div
            key={action.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="flex flex-col items-center gap-2"
            onClick={() => navigate(action.path)}
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${action.color} p-[1px] cursor-pointer active:scale-95 transition-transform`}>
              <div className="w-full h-full bg-[#111827] rounded-2xl flex items-center justify-center">
                <action.icon size={22} className="text-white" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{action.name}</span>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <h3 className="text-lg font-semibold mb-4 px-1">Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Card className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-blue-400 mb-1"><PlaySquare size={24} /></span>
            <p className="text-xl font-bold">{userData?.completedTasks || 0}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Total Tasks</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <Card className="p-4 flex flex-col justify-center items-center text-center">
            <span className="text-purple-400 mb-1"><Users size={24} /></span>
            <p className="text-xl font-bold">0</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Total Referrals</p>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}

// Simple PlaySquare icon that wasn't imported properly
function PlaySquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 8 6 4-6 4Z" />
    </svg>
  );
}
