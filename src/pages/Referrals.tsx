import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Copy, Share2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Referrals() {
  const { userData } = useAuthStore();
  const [copied, setCopied] = useState(false);

  const referralCode = userData?.referralCode || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Earnexa',
        text: `Join me on Earnexa and start earning today! Use my referral code: ${referralCode}`,
      });
    }
  };

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="mb-6 relative z-10">
        <h1 className="text-2xl font-bold mb-2">Refer & Earn</h1>
        <p className="text-gray-400 text-sm">Invite friends and earn 5% of their lifetime earnings forever.</p>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="mb-8 p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Users size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold mb-1">Invite Friends</h2>
          <p className="text-sm text-gray-400 mb-6">You'll both get a bonus when they join!</p>

          <div className="bg-[#0b1120] rounded-xl p-3 flex items-center justify-between border border-white/5 mb-4 relative py-4">
            <span className="font-mono text-emerald-400 font-bold tracking-widest text-lg ml-2">{referralCode}</span>
            <div className="flex items-center gap-2 absolute right-2">
              <Button size="icon" variant="glass" className="w-10 h-10 rounded-lg" onClick={handleCopy}>
                {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </Button>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25" size="lg" onClick={handleShare}>
            <Share2 size={18} className="mr-2" />
            Share Code
          </Button>
        </Card>
      </motion.div>

      <h3 className="text-lg font-semibold mb-4 px-1">Your Referral Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-white mb-1">0</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Friends Joined</p>
        </Card>
        <Card className="p-4 flex flex-col justify-center items-center text-center">
          <p className="text-3xl font-bold text-emerald-400 mb-1">$0.00</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Earned Commision</p>
        </Card>
      </div>
    </div>
  );
}
