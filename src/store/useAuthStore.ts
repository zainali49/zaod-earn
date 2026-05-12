import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserData {
  uid: string;
  email: string;
  role: 'user' | 'advertiser';
  balance: number;
  completedTasks: number;
  dailyTasksDone: number;
  lastTaskDate: string;
  referralCode: string;
  referredBy: string | null;
  plan: 'Free' | 'Starter' | 'Pro' | 'Premium' | 'VIP';
  isBlocked: boolean;
  createdAt: number;
}

interface AuthState {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (data: UserData | null) => void;
  fetchUserData: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  loading: true,
  setUser: (user) => set({ user }),
  setUserData: (data) => set({ userData: data }),
  fetchUserData: async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        set({ userData: docSnap.data() as UserData });
      }
    } catch (e: any) {
      console.error("Error fetching user data:", e.message);
      if (e.message?.includes('Missing or insufficient permissions')) {
        console.error(
          "FIREBASE RULES ERROR: You need to update your Firestore security rules in the Firebase Console!\n" +
          "Go to Firebase Console -> Firestore Database -> Rules and add:\n\n" +
          "match /databases/{database}/documents {\n" +
          "  match /{document=**} {\n" +
          "    allow read, write: if request.auth != null;\n" +
          "  }\n" +
          "}"
        );
      }
    }
  }
}));
