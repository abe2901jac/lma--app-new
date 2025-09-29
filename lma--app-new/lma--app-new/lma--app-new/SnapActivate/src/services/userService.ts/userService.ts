'use server';

import {db, auth} from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  getDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { createPackage } from './campaignService';

export const createUser = async (uid: string, userData: any) => {
  try {
    const userDocRef = doc(db, 'users', uid);

    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });

    console.log('Firestore document written for UID: ', uid);
    return {id: uid, ...userData};
  } catch (e) {
    console.error('Error adding document: ', e);
    return null;
  }
};

const seedInitialData = async () => {
  console.log('Seeding initial data into Firestore...');
  const batch = writeBatch(db);

  const users = {
    admin: { uid: 'admin-user-id', email: 'admin@example.com', name: 'Admin User', role: 'admin', status: 'approved' },
    brand: { uid: 'brand-user-id', email: 'brand@example.com', name: 'Brand Manager', role: 'brand', companyName: 'FizzCo Inc.', paymentPlan: 'elite' },
    promoter1: { uid: 'promoter1-user-id', email: 'promoter1@example.com', name: 'Alice Johnson', role: 'promoter', status: 'approved' },
    promoter2: { uid: 'promoter2-user-id', email: 'promoter2@example.com', name: 'Bob Williams', role: 'promoter', status: 'pending' },
  };

  Object.values(users).forEach(user => {
    const userRef = doc(db, 'users', user.uid);
    batch.set(userRef, {...user, createdAt: serverTimestamp()});
  });

  const packages = [
    { name: "Bronze", price: "1800", promoters: 2, locations: 1 },
    { name: "Silver", price: "2500", promoters: 3, locations: 2 },
    { name: "Gold", price: "5000", promoters: 5, locations: 3 },
    { name: "Platinum", price: "12000", promoters: 10, locations: 5 },
  ];

  packages.forEach(pkg => {
    const pkgRef = doc(collection(db, 'packages'));
    batch.set(pkgRef, pkg);
  });

  const campaigns = [
    { title: 'Summer Soda Fest', brandId: users.brand.uid, brandName: 'FizzCo Inc.', packageTier: 'Gold', status: 'Active', locationZone: 'Downtown', date: '2024-07-15T12:00:00Z' },
    { title: 'Winter Warmer Launch', brandId: users.brand.uid, brandName: 'FizzCo Inc.', packageTier: 'Silver', status: 'Completed', locationZone: 'Suburbs', date: '2024-05-20T12:00:00Z' },
    { title: 'New Energy Drink Promo', brandId: users.brand.uid, brandName: 'FizzCo Inc.', packageTier: 'Platinum', status: 'Pending Payment', locationZone: 'Uptown', date: '2024-08-01T12:00:00Z' },
  ];

  campaigns.forEach(campaign => {
    const campaignRef = doc(collection(db, 'campaigns'));
    batch.set(campaignRef, {...campaign, createdAt: serverTimestamp()});
  });

  try {
    await batch.commit();
    console.log('Initial data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding data:', error);
    return false;
  }
};

export const signInUser = async (
  email: string,
  password: string,
  requiredRole?: string
) => {
  if (email.endsWith('@example.com')) {
    const usersRef = collection(db, 'users');
    const allUsersSnapshot = await getDocs(query(usersRef, limit(1)));
    if (allUsersSnapshot.empty) {
      await seedInitialData();
      return {
        success: false,
        error: 'Database has been seeded. Please try signing in again to use the mock account.',
      };
    }

    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        error: `Mock user ${email} not found. Please use a valid mock email.`,
      };
    }

    const mockUserDoc = querySnapshot.docs[0];
    const mockUserData = mockUserDoc.data();
    
    if (requiredRole && mockUserData.role !== requiredRole) {
      return {
        success: false,
        error: `You do not have permission to access the ${requiredRole} dashboard.`,
      };
    }
    
    try {
      // This special email format allows Firebase Auth to work while keeping the original mock email for Firestore queries.
      // We use a fixed password for all mock user auth objects for simplicity.
      const mockAuthEmail = `mock-${mockUserDoc.id}@example.com`;
      await signInWithEmailAndPassword(auth, mockAuthEmail, 'mockpassword');
    } catch (e: any) {
        if(e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
            const mockAuthEmail = `mock-${mockUserDoc.id}@example.com`;
            // If the mock auth user doesn't exist, create it.
            await createUserWithEmailAndPassword(auth, mockAuthEmail, 'mockpassword');
            // Try signing in again after creation.
            await signInWithEmailAndPassword(auth, mockAuthEmail, 'mockpassword');
        } else {
          return { success: false, error: "An unexpected error occurred during mock sign-in." };
        }
    }
    
    return { success: true };
  }

  // Handle real users
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (requiredRole) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === requiredRole) {
        return {success: true };
      } else {
        await auth.signOut();
        const errorMessage = userDoc.exists()
          ? `You do not have permission to access the ${requiredRole} dashboard.`
          : 'User data not found.';
        return {success: false, error: errorMessage};
      }
    }

    return {success: true};
  } catch (error: any) {
    let errorMessage = 'An unknown error occurred.';
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        errorMessage = 'Invalid credentials. Please check your email and password.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      default:
        errorMessage = error.message;
        break;
    }
    return {success: false, error: errorMessage};
  }
};

export const getUserById = async (userId: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return {id: userDoc.id, ...userDoc.data()};
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const getUsersByRole = async (role: string, status?: string) => {
  try {
    const usersRef = collection(db, 'users');
    let q;

    if (status) {
      q = query(usersRef, where('role', '==', role), where('status', '==', status));
    } else {
      q = query(usersRef, where('role', '==', role));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    return [];
  }
};

export const approvePromoter = async (promoterId: string) => {
  try {
    const userDocRef = doc(db, 'users', promoterId);
    await updateDoc(userDocRef, {
      status: 'approved',
    });
    return true;
  } catch (error) {
    console.error('Error approving promoter:', error);
    return false;
  }
};

export const rejectPromoter = async (promoterId: string) => {
  try {
    const userDocRef = doc(db, 'users', promoterId);
    await updateDoc(userDocRef, {
      status: 'rejected',
    });
    return true;
  } catch (error) {
    console.error('Error rejecting promoter:', error);
    return false;
  }
};