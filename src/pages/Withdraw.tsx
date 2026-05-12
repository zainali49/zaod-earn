import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, Smartphone, Building, Landmark, Ban } from 'lucide-react';

export default function Withdraw() {
  const { userData, user } = useAuthStore();
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const methods = [
    { id: 'jazzcash', name: 'JazzCash', icon: Smartphone, color: 'text-red-500' },
    { id: 'easypaisa', name: 'Easypaisa', icon: Smartphone, color: 'text-green-500' },
    { id: 'binance', name: 'Binance', icon: WalletIcon, color: 'text-yellow-500' },
    { id: 'bank', name: 'Bank Transfer', icon: Landmark, color: 'text-blue-500' },
    { id: 'skrill', name: 'Skrill', icon: Building, color: 'text-purple-500' },
  ];

  const MIN_WITHDRAW = 30; // 30 USD
  const MIN_TASKS = 40;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const withdrawAmount = parseFloat(amount);
    
    if (!method) {
      setMessage({ text: 'Please select a withdrawal method', type: 'error' });
      return;
    }
    if (isNaN(withdrawAmount) || withdrawAmount < MIN_WITHDRAW) {
      setMessage({ text: `Minimum withdrawal is $${MIN_WITHDRAW}`, type: 'error' });
      return;
    }
    if ((userData?.balance || 0) < withdrawAmount) {
      setMessage({ text: 'Insufficient balance', type: 'error' });
      return;
    }
    if ((userData?.completedTasks || 0) < MIN_TASKS) {
      setMessage({ text: `You must complete at least ${MIN_TASKS} tasks to withdraw`, type: 'error' });
      return;
    }
    if (!accountName || !accountNumber) {
      setMessage({ text: 'Please fill all account details', type: 'error' });
      return;
    }

    // Check account age (7 days)
    const accountAge = (Date.now() - (userData?.createdAt || Date.now())) / (1000 * 60 * 60 * 24);
    if (accountAge < 7) {
      setMessage({ text: `Account must be at least 7 days old. Your account is ${Math.floor(accountAge)} days old.`, type: 'error' });
      return;
    }

    setLoading(true);
    try {
      if (!user) throw new Error("No user");

      const withdrawalId = `wd_${Date.now()}_${user.uid.substring(0, 5)}`;
      
      // Update User Balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(-withdrawAmount)
      });

      // Create Withdrawal Request
      await setDoc(doc(db, 'withdrawals', withdrawalId), {
        userId: user.uid,
        amount: withdrawAmount,
        method,
        accountName,
        accountNumber,
        status: 'pending',
        createdAt: Date.now()
      });

      // Transaction entry
      await setDoc(doc(db, 'transactions', withdrawalId), {
        userId: user.uid,
        type: 'withdrawal',
        amount: withdrawAmount,
        status: 'pending',
        createdAt: Date.now(),
        description: `Withdrawal to ${method.toUpperCase()}`
      });

      // Update Local State silently
      useAuthStore.getState().fetchUserData(user.uid);

      setMessage({ text: 'Withdrawal request submitted successfully. It will be processed soon.', type: 'success' });
      setAmount('');
      setAccountName('');
      setAccountNumber('');
      setMethod('');
      
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to process request', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Withdraw Funds</h1>
        <p className="text-gray-400 text-sm">Transfer your earnings to your preferred account.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Min. Withdraw</p>
          <p className="font-semibold text-white">${MIN_WITHDRAW}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Min. Tasks Active</p>
          <p className="font-semibold text-white">{MIN_TASKS}</p>
        </Card>
      </div>

      <form onSubmit={handleWithdraw} className="space-y-6">
        {message.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-3 rounded-xl border text-sm ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
            {message.text}
          </motion.div>
        )}

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300 ml-1">Select Method</label>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => (
              <div 
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${method === m.id ? 'bg-white/10 border-blue-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${m.color}`}>
                  <m.icon size={16} />
                </div>
                <span className="text-sm font-medium">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
             <label className="text-sm font-semibold text-gray-300 ml-1 mb-2 block">Account Title / Name</label>
             <Input 
               placeholder="e.g. John Doe" 
               value={accountName}
               onChange={(e) => setAccountName(e.target.value)}
             />
          </div>
          <div>
             <label className="text-sm font-semibold text-gray-300 ml-1 mb-2 block">Account Number / Email</label>
             <Input 
               placeholder="e.g. 03001234567 or email@binance.com" 
               value={accountNumber}
               onChange={(e) => setAccountNumber(e.target.value)}
             />
          </div>
          <div>
             <label className="text-sm font-semibold text-gray-300 ml-1 mb-2 block">Amount (USD) - Max: ${userData?.balance?.toFixed(4)}</label>
             <Input 
               type="number"
               step="0.01"
               placeholder="30.00" 
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
             />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Withdrawal Request'}
        </Button>
      </form>
    </div>
  );
}
