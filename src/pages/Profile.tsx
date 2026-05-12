import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/card';
import { User, Mail, Calendar, Shield, Award, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { userData, user } = useAuthStore();
  const navigate = useNavigate();

  const joinDate = userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : 'Unknown';

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="flex justify-between items-center mb-8 relative z-10 px-2 mt-4">
        <h1 className="text-2xl font-bold">Profile</h1>
        <div onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center cursor-pointer">
          <SettingsIcon size={20} className="text-gray-300" />
        </div>
      </div>

      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1 mb-4">
          <div className="w-full h-full bg-[#0b1120] rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">{userData?.email?.split('@')[0]}</h2>
        <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
          <Award size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">{userData?.plan || 'Free'} Plan</span>
        </div>
      </motion.div>

      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">Account Details</h3>
      
      <Card className="divide-y divide-white/5 border-white/5 bg-white/5">
        <div className="flex items-center p-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
           <Mail size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Email</span>
            <span className="text-sm text-white font-medium">{user?.email}</span>
          </div>
        </div>
        
        <div className="flex items-center p-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
           <Calendar size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Joined</span>
            <span className="text-sm text-white font-medium">{joinDate}</span>
          </div>
        </div>

        <div className="flex items-center p-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
           <Shield size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Status</span>
            <span className="text-sm text-emerald-400 font-medium leading-none flex items-center gap-1">
              Active
            </span>
          </div>
        </div>
      </Card>
      
      <div className="mt-8">
        <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/20 p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white mb-1">Upgrade to Premium</h3>
            <p className="text-xs text-gray-400">Unlock higher earning limits</p>
          </div>
          <div className="bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
            View Plans
          </div>
        </Card>
      </div>

    </div>
  );
}
