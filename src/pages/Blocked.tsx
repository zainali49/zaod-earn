import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/button';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Blocked() {
  const { userData } = useAuthStore();
  
  return (
    <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">ð</span>
      </div>
      <h1 className="text-2xl font-bold text-red-500 mb-2">Account Blocked</h1>
      <p className="text-gray-400 max-w-sm mb-8">
        Your account has been suspended due to violation of our terms of service. Please contact support if you believe this is a mistake.
      </p>
      <Button variant="outline" onClick={() => signOut(auth)}>
        Logout
      </Button>
    </div>
  );
}
