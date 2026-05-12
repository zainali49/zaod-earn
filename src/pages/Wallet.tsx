import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card } from '../components/ui/card';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'referral';
  amount: number;
  status: 'completed' | 'pending' | 'rejected';
  createdAt: number;
  description: string;
}

export default function Wallet() {
  const { userData, user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Conversion rate (rough estimation: 1 USD = 280 PKR)
  const USD_TO_PKR = 280;

  useEffect(() => {
    async function fetchTxs() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const txs: Transaction[] = [];
        snap.forEach(doc => {
          txs.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(txs);
      } catch (e) {
        console.error("Error fetching transactions", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTxs();
  }, [user]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'earning': return <ArrowDownLeft className="text-emerald-400" size={20} />;
      case 'withdrawal': return <ArrowUpRight className="text-red-400" size={20} />;
      case 'referral': return <ArrowRightLeft className="text-blue-400" size={20} />;
      default: return <Clock size={20} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  }

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="mb-6 relative z-10">
        <h1 className="text-2xl font-bold mb-2">Wallet</h1>
        <p className="text-gray-400 text-sm">Manage your earnings and transactions.</p>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Card className="mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full" />
          <div className="p-6 relative z-10 flex flex-col items-center text-center">
            <p className="text-gray-400 text-sm mb-2">Available Balance</p>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-1">
              <span className="text-2xl text-blue-400 mr-1">$</span>
              {userData?.balance?.toFixed(4) || "0.0000"}
            </h1>
            <p className="text-gray-500 text-sm font-medium tracking-wide">
              â (PKR {(userData?.balance || 0 * USD_TO_PKR).toFixed(2)})
            </p>
          </div>
        </Card>
      </motion.div>

      <h3 className="text-lg font-semibold mb-4 px-1">Recent Transactions</h3>
      
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">No transactions yet.</p>
          </div>
        ) : (
          transactions.map((tx, idx) => (
            <motion.div 
              key={tx.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-4 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  {getIcon(tx.type)}
                </div>
                <div>
                  <p className="text-sm font-semibold capitalize">{tx.type}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()} â {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-white' : 'text-emerald-400'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(4)}
                </span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(tx.status)}`}>
                  {tx.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
