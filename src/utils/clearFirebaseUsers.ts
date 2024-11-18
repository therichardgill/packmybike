import { auth, db } from '../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { listUsers, deleteUser } from 'firebase/auth';

export async function clearAllUsers() {
  try {
    // Clear Firestore users collection
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    const deletePromises = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    console.log('All Firestore user documents cleared');

  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}