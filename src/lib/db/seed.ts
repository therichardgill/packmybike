import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, Timestamp } from 'firebase/firestore';
import { FEATURED_LISTINGS, RECENT_LISTINGS } from '../../data/listings';

const seedDatabase = async () => {
  try {
    // Seed Users
    const users = [
      {
        id: '1',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Thompson',
        mobile: '+14155552671',
        role: 'user',
        status: 'active',
        listings: [],
        createdAt: new Date('2023-01-01').toISOString(),
        lastLogin: new Date().toISOString(),
        verifiedEmail: true,
        verifiedMobile: true,
        notificationPreferences: {
          email: true,
          sms: true,
        },
      },
      {
        id: '2',
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Wilson',
        mobile: '+14155552672',
        role: 'user',
        status: 'active',
        listings: [],
        createdAt: new Date('2023-01-15').toISOString(),
        lastLogin: new Date().toISOString(),
        verifiedEmail: true,
        verifiedMobile: true,
        notificationPreferences: {
          email: true,
          sms: false,
        },
      },
    ];

    // Seed Brands
    const brands = [
      {
        id: '1',
        name: 'EVOC',
        website: 'https://www.evocsports.com',
        description: 'German manufacturer specializing in sports bags and protection gear',
        headquarters: 'Munich, Germany',
        foundedYear: 2000,
        specialties: ['Bike Travel Bags', 'Protection Gear', 'Sports Backpacks'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Thule',
        website: 'https://www.thule.com',
        description: 'Swedish outdoor and transportation products company',
        headquarters: 'Malmö, Sweden',
        foundedYear: 1942,
        specialties: ['Bike Carriers', 'Roof Racks', 'Travel Cases'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Seed Bags
    const bags = [
      {
        id: '1',
        brandId: '1',
        model: 'BIKE TRAVEL PRO',
        protectionLevel: 5,
        transportRating: 5,
        wheelSize: {
          min: 26,
          max: 29,
        },
        weight: {
          empty: 8600,
          maxLoad: 23000,
        },
        dimensions: {
          length: 130,
          width: 35,
          height: 80,
        },
        volume: 285,
        tsaCompliant: 'Yes',
        manualUrl: 'https://www.evocsports.com/media/a2/4a/5e/1648801531/22_MANUAL_BIKE-BAG-PRO.pdf',
        packingGuideUrl: 'https://www.evocsports.com/bike-bag-pro-packing-guide',
        compatibility: ['mountainBike', 'roadBike', 'hybridBike', 'ebike'],
        securityFeatures: [
          'TSA-approved locks',
          'Reinforced corners',
          'Anti-theft tracking device',
          'Double-layered zippers'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        brandId: '2',
        model: 'ROUNDTRIP PRO XT',
        protectionLevel: 4,
        transportRating: 4,
        wheelSize: {
          min: 26,
          max: 29,
        },
        weight: {
          empty: 7700,
          maxLoad: 22000,
        },
        dimensions: {
          length: 137,
          width: 38,
          height: 85,
        },
        volume: 280,
        tsaCompliant: 'Yes',
        compatibility: ['mountainBike', 'roadBike', 'hybridBike'],
        securityFeatures: [
          'Integrated lock system',
          'Reinforced panels',
          'Security straps'
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Write to Firestore
    const collections = {
      users,
      brands,
      bags,
    };

    for (const [collectionName, items] of Object.entries(collections)) {
      const collectionRef = collection(db, collectionName);
      for (const item of items) {
        const docRef = doc(collectionRef, item.id.toString());
        await setDoc(docRef, item);
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    const collections = ['users', 'brands', 'bags', 'listings', 'reviews', 'bookings', 'shortUrls'];

    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      // Delete documents one by one
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

export default seedDatabase;