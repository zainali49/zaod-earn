import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col relative overflow-hidden px-6 pb-12 pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-md bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8">
            <span className="text-2xl font-bold text-white">EX</span>
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-4 tracking-[-0.02em]">
            Watch.<br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Earn.</span><br/>
            Withdraw.
          </h1>
          
          <p className="text-gray-400 text-lg mb-12">
            The premium platform to earn real rewards by watching sponsored content. Join today and start earning.
          </p>

          <div className="mt-auto flex flex-col gap-4">
            <Button size="lg" onClick={() => navigate('/signup')} className="w-full text-lg">
              Create Account
            </Button>
            <Button variant="glass" size="lg" onClick={() => navigate('/login')} className="w-full text-lg">
              Sign In
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
