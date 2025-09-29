import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getUserById } from './userService';

export const getPackages = async () => {
    const packagesCol = collection(db, 'packages');
    const packagesSnapshot = await getDocs(packagesCol);
    const packageList = packagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return packageList as any[];
};

export const createPackage = async (pkg: Omit<any, 'id'>) => {
    const packagesCol = collection(db, 'packages');
    const docRef = await addDoc(packagesCol, pkg);
    return { id: docRef.id, ...pkg };
};

export const updatePackage = async (pkgId: string, updates: Partial<any>) => {
    const packageDoc = doc(db, 'packages', pkgId);
    await updateDoc(packageDoc, updates);
    return { id: pkgId, ...updates };
};

export const deletePackage = async (pkgId: string) => {
    try {
        await deleteDoc(doc(db, 'packages', pkgId));
        return true;
    } catch (error) {
        console.error("Error deleting package:", error);
        return false;
    }
};

export const bookCampaign = async (campaignData: any, brandId: string) => {
  try {
    const brand = await getUserById(brandId);

    if (!brand) {
      throw new Error("Brand user not found.");
    }

    let status;
    if (brand.paymentPlan === 'standard') {
      status = 'Pending Payment';
    } else if (brand.paymentPlan === 'elite') {
      status = 'Pending PO';
    } else {
      status = 'Pending Review';
    }

    const { brief, ...dataToStore } = campaignData;
    
    const docRef = await addDoc(collection(db, 'campaigns'), {
      ...dataToStore,
      brandId: brandId,
      brandName: brand.companyName || brand.name,
      status: status,
      createdAt: serverTimestamp(),
    });

    console.log("Campaign document written with ID: ", docRef.id);
    return { id: docRef.id, status, ...dataToStore };

  } catch (error) {
    console.error("Error booking campaign: ", error);
    return null;
  }
};

export const getCampaigns = async (status?: string | string[]) => {
    try {
        const campaignsRef = collection(db, 'campaigns');
        let q;

        if (Array.isArray(status) && status.length > 0) {
            q = query(campaignsRef, where('status', 'in', status));
        } else if (typeof status === 'string') {
            q = query(campaignsRef, where('status', '==', status));
        } else {
            q = query(campaignsRef);
        }

        const querySnapshot = await getDocs(q);
        const campaigns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return campaigns;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
}

export const getCampaignsByBrand = async (brandId: string) => {
    try {
        const campaignsRef = collection(db, 'campaigns');
        const q = query(campaignsRef, where('brandId', '==', brandId));
        
        const querySnapshot = await getDocs(q);
        const campaigns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return campaigns;
    } catch (error) {
        console.error(`Error fetching campaigns for brand ${brandId}:`, error);
        return [];
    }
}