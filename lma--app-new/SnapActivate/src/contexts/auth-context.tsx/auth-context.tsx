"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        let userId = user.uid;
        // This logic handles the special mock user case for demo purposes.
        if (user.email?.startsWith('mock-')) {
          userId = user.email.replace('mock-', '').replace('@example.com', '');
        }

        setUser(user);
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const fetchedUserData = { id: userDoc.id, ...userDoc.data() };
          setUserData(fetchedUserData);
          
          const publicPages = ['/', '/sign-up', '/terms', '/privacy'];
          const isPublicPage = publicPages.includes(pathname) || pathname.startsWith('/sign-in');

          if (isPublicPage) {
            const role = fetchedUserData.role;
            if (role === 'admin') router.push('/admin');
            else if (role === 'brand') router.push('/brand');
            else if (role === 'promoter') router.push('/promoter');
          }

        } else {
          // If the corresponding Firestore doc doesn't exist, sign out.
          setUserData(null);
          await auth.signOut();
        }
      } else {
        // User is signed out
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const value = { user, userData, loading };

  if (loading) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Logo className="h-24 animate-pulse" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}