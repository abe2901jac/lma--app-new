import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a new support ticket document in Firestore.
 * @param ticketData - The data for the support ticket, including campaignName, issueDescription, and priority.
 * @param brandId - The UID of the user reporting the issue.
 * @returns The ID of the newly created ticket document, or null on failure.
 */
export const createSupportTicket = async (ticketData: any, brandId: string) => {
  try {
    const docRef = await addDoc(collection(db, 'supportTickets'), {
      ...ticketData,
      brandId,
      status: 'New', // Initial status for all new tickets
      createdAt: serverTimestamp(),
    });

    console.log("Support ticket created with ID: ", docRef.id);
    // Return a formatted ticket ID for user-facing confirmation
    return `TICKET-${docRef.id.substring(0, 6).toUpperCase()}`;
  } catch (error) {
    console.error("Error creating support ticket: ", error);
    return null;
  }
};