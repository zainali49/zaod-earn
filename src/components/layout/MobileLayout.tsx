import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlaySquare, Wallet, Users, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';

export default function MobileLayout() {
  const { userData } = useAuthStore();
  
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Tasks', path: '/tasks', icon: PlaySquare },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Refer', path: '/referrals', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (userData?.role === 'advertiser') {
    // Modify nav for advertiser if needed, or redirect them entirely
    // We will keep it simple for now or change one tab.
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0b1120] pb-20">
      <div className="flex-1 overflow-y-auto w-full max-w-md mx-auto relative relative-z-10">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
        <nav className="w-full max-w-md glass-panel flex items-center justify-around py-3 px-2 rounded-t-[2rem]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center p-2 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-blue-400 bg-blue-500/10 scale-110"
                    : "text-gray-500 hover:text-gray-400"
                )
              }
            >
              <item.icon className="w-6 h-6 mb-1" strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
