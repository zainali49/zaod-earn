import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Moon, Bell, LogOut, ShieldAlert, LifeBuoy } from 'lucide-react';

export default function Settings() {
  
  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="mb-6 relative z-10">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage app preferences and account</p>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">Preferences</h3>
          <Card className="divide-y divide-white/5 border-white/5 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-blue-400" />
                <span className="text-sm font-medium">Dark Mode</span>
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center p-1 justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-purple-400" />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <div className="w-10 h-6 bg-blue-500 rounded-full flex items-center p-1 justify-end">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">Support</h3>
          <Card className="divide-y divide-white/5 border-white/5 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <LifeBuoy size={20} className="text-emerald-400" />
                <span className="text-sm font-medium">Help Center / WhatsApp</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <ShieldAlert size={20} className="text-amber-400" />
                <span className="text-sm font-medium">Privacy Policy</span>
              </div>
            </div>
          </Card>
        </section>

        <Button 
          variant="outline" 
          size="lg" 
          className="w-full mt-4 text-red-400 border-red-500/30 hover:bg-red-500/10" 
          onClick={() => signOut(auth)}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
