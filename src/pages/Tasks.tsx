import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/useAuthStore';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Play, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { AdMob, RewardAdOptions, AdLoadInfo, RewardAdPluginEvents } from '@capacitor-community/admob';

export default function Tasks() {
  const { userData, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [adState, setAdState] = useState<'idle' | 'loading' | 'playing' | 'rewarded'>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAdMobReady, setIsAdMobReady] = useState(false);
  const [adMobError, setAdMobError] = useState('');

  // Constants
  const REWARD_AMOUNT = 0.002;
  const AD_DURATION = 10; // 10 seconds for web simulation
  const AD_UNIT_ID = 'ca-app-pub-1022158108948914/6711238413';
  const totalDailyTasks = userData?.plan === 'VIP' ? 999999 : userData?.plan === 'Premium' ? 400 : userData?.plan === 'Pro' ? 200 : userData?.plan === 'Starter' ? 100 : 50;

  const isLimitReached = (userData?.dailyTasksDone || 0) >= totalDailyTasks;

  useEffect(() => {
    // Initialize AdMob if on native device (APK)
    let isSubscribed = true;

    async function initAdMob() {
      if (!Capacitor.isNativePlatform()) return;
      
      try {
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          initializeForTesting: false, // Set to true if testing
        });
        
        // Listeners for Rewarded Ads
        AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
          if (!isSubscribed) return;
          console.log("AdMob Ad Loaded", info);
          setAdState('playing');
          AdMob.showRewardVideoAd().catch(e => {
            console.error("Ad Show Error", e);
            setAdState('idle');
          });
        });

        AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          if (!isSubscribed) return;
          completeTask(); // The user watched the ad, give reward
        });

        AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          if (!isSubscribed) return;
          // If the user dismissed the ad, we reset it (unless they already got rewarded, which handled above)
          setAdState(prev => prev === 'rewarded' ? 'rewarded' : 'idle');
        });

        AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err) => {
          if (!isSubscribed) return;
          console.error("Ad Failed to load", err);
          setAdMobError('Ad failed to load. Please try again.');
          setAdState('idle');
        });

        setIsAdMobReady(true);
      } catch (e) {
        console.error("AdMob Init Error", e);
      }
    }

    initAdMob();

    return () => {
      isSubscribed = false;
      if (Capacitor.isNativePlatform()) {
         AdMob.removeAllListeners();
      }
    };
  }, []); // Run once on mount

  const handleWatchAd = async () => {
    if (isLimitReached) return;
    
    setAdState('loading');
    setAdMobError('');
    
    if (Capacitor.isNativePlatform() && isAdMobReady) {
      // --- NATIVE APK: REAL ADMOB AD ---
      try {
        const options: RewardAdOptions = {
          adId: AD_UNIT_ID,
          isTesting: false // Ensure false in production
        };
        await AdMob.prepareRewardVideoAd(options);
        // It will start showing when 'Loaded' listener fires
      } catch (err) {
        console.error("Error preparing ad:", err);
        setAdMobError('Error preparing ad. Please try again later.');
        setAdState('idle');
      }
    } else {
      // --- WEB/SIMULATION ---
      setTimeout(() => {
        setAdState('playing');
        setTimeLeft(AD_DURATION);
        
        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              completeTask();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      }, 1500);
    }
  };

  const completeTask = async () => {
    setAdState('rewarded');
    
    try {
      if (!user || !userData) return;

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(REWARD_AMOUNT),
        completedTasks: increment(1),
        dailyTasksDone: increment(1),
        lastTaskDate: new Date().toISOString().split('T')[0]
      });

      // Also record transaction
      const txRef = doc(db, 'transactions', `${user.uid}_${Date.now()}`);
      await setDoc(txRef, {
        userId: user.uid,
        type: 'earning',
        amount: REWARD_AMOUNT,
        status: 'completed',
        createdAt: Date.now(),
        description: 'Watched Rewarded Ad'
      });
      
      // Update local store silently
      useAuthStore.getState().fetchUserData(user.uid);

      setTimeout(() => {
        setAdState('idle');
      }, 3000); // show success for 3s
      
    } catch (e) {
      console.error("Failed to complete task:", e);
      setAdState('idle');
    }
  };

  return (
    <div className="flex flex-col relative px-4 pt-12 pb-24 min-h-screen">
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="mb-8 relative z-10">
        <h1 className="text-2xl font-bold mb-2">Watch & Earn</h1>
        <p className="text-gray-400 text-sm">Watch sponsored content to earn USD directly to your wallet.</p>
      </div>

      <Card className="mb-8 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
        
        <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
          <Play className="text-blue-400" size={32} />
        </div>
        
        <h2 className="text-xl font-semibold mb-1">Rewarded Video</h2>
        <p className="text-sm text-gray-400 mb-6">Earn ${REWARD_AMOUNT.toFixed(3)} per video</p>

        <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all" 
            style={{ width: `${Math.min(((userData?.dailyTasksDone || 0) / (totalDailyTasks === 999999 ? 10 : totalDailyTasks)) * 100, 100)}%` }} 
          />
        </div>
        <p className="text-xs text-gray-400 mb-6 w-full text-right">
          Daily Limit: {userData?.dailyTasksDone || 0} / {totalDailyTasks === 999999 ? 'Unlimited' : totalDailyTasks}
        </p>

        {isLimitReached ? (
          <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 py-2 px-4 rounded-xl border border-amber-400/20">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">Daily limit reached. Come back tomorrow!</span>
          </div>
        ) : (
          <>
            <Button 
              size="lg" 
              className="w-full relative overflow-hidden group" 
              disabled={adState !== 'idle'}
              onClick={handleWatchAd}
            >
              {adState === 'idle' && (
                <span className="flex items-center gap-2">
                  <Play size={18} />
                  Watch Ad
                </span>
              )}
              {adState === 'loading' && (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  Loading Ad...
                </span>
              )}
              {adState === 'playing' && (
                <span className="flex items-center gap-2">
                  Playing... {timeLeft > 0 ? `${timeLeft}s` : ''}
                </span>
              )}
              {adState === 'rewarded' && (
                <span className="flex items-center gap-2 text-emerald-300">
                  <Check size={18} />
                  Reward Claimed!
                </span>
              )}
              
              {/* Shimmer effect for button */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shimmer" />
            </Button>
            {adMobError && (
              <p className="text-red-400 text-xs mt-3">{adMobError}</p>
            )}
          </>
        )}
      </Card>

      <AnimatePresence>
        {adState === 'playing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-[#0b1120] flex flex-col items-center justify-center p-6"
          >
            <div className="w-full max-w-sm aspect-video bg-black rounded-2xl border border-white/10 mb-8 relative overflow-hidden flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <span className="text-gray-500 font-mono tracking-widest uppercase text-xs">Simulated Ad Content</span>
              {/* Fake progress bar at bottom */}
              <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${((AD_DURATION - timeLeft) / AD_DURATION) * 100}%` }} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Watching Ad</h2>
            <p className="text-gray-400 mb-8 text-center max-w-xs">Please wait for the ad to finish to receive your reward.</p>
            
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-purple-500 animate-spin flex items-center justify-center relative">
               <div className="absolute text-white font-bold animate-none">{timeLeft}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Configuration Comments for later APK build */}
      <div className="hidden">
        {/*
          AdMob Details:
          App ID: ca-app-pub-1022158108948914~6084552451
          Banner: ca-app-pub-1022158108948914/6697872533
          Interstitial: ca-app-pub-1022158108948914/9894881516
          Rewarded Video: ca-app-pub-1022158108948914/6711238413
          App Open: ca-app-pub-1022158108948914/4071709193
        */}
      </div>
    </div>
  );
}
