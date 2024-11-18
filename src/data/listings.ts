export const FEATURED_LISTINGS = [
  {
    id: 1,
    owner: {
      id: '1',
      firstName: 'Mike',
      lastName: 'Thompson',
    },
    location: "Boulder, CO",
    rating: 4.9,
    reviews: 124,
    upvotes: 89,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 35,
      weeklyRate: 210
    },
    image: "https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=800",
    description: "Professional bike bags available for rent. Perfect for air travel. Our bags feature extra padding, wheel compartments, and TSA-approved locks. Includes comprehensive insurance coverage.",
    available: true,
    featured: true,
    bagSpecs: {
      brand: "EVOC",
      model: "BIKE TRAVEL PRO",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: true
      },
      protectionLevel: 5,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 5,
      weight: {
        empty: 8.6,
        maxLoad: 23
      },
      dimensions: {
        length: 130,
        width: 35,
        height: 80
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "TSA-approved locks",
        "Reinforced corners",
        "Anti-theft tracking device",
        "Double-layered zippers"
      ]
    }
  },
  {
    id: 2,
    owner: {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Wilson',
    },
    location: "Portland, OR",
    rating: 4.8,
    reviews: 89,
    upvotes: 67,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 30,
      weeklyRate: 180
    },
    image: "https://images.unsplash.com/photo-1496150590317-f8d952453f93?auto=format&fit=crop&q=80&w=800",
    description: "Specialized bike travel cases with padding and wheel compartments. Each case is thoroughly inspected between rentals and includes premium foam padding for maximum protection.",
    available: true,
    featured: true,
    bagSpecs: {
      brand: "Thule",
      model: "ROUNDTRIP PRO XT",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: false
      },
      protectionLevel: 4,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 4,
      weight: {
        empty: 7.7,
        maxLoad: 22
      },
      dimensions: {
        length: 137,
        width: 38,
        height: 85
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "Integrated lock system",
        "Reinforced panels",
        "Security straps"
      ]
    }
  },
  {
    id: 3,
    owner: {
      id: '3',
      firstName: 'Richard',
      lastName: 'Garcia',
    },
    location: "Denver, CO",
    rating: 4.7,
    reviews: 76,
    upvotes: 45,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 40,
      weeklyRate: 240
    },
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800",
    description: "Premium bike bags with insurance included. 24/7 support. Our cases are airline-approved and come with tracking devices for peace of mind during transit.",
    available: false,
    featured: false,
    bagSpecs: {
      brand: "B&W",
      model: "BIKE GUARD CURV",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: true
      },
      protectionLevel: 5,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 4,
      weight: {
        empty: 8.2,
        maxLoad: 25
      },
      dimensions: {
        length: 131,
        width: 37,
        height: 83
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "TSA-approved locks",
        "Impact-resistant shell",
        "GPS tracking"
      ]
    }
  }
];

export const RECENT_LISTINGS = [
  {
    id: 4,
    owner: {
      id: '4',
      firstName: 'David',
      lastName: 'Brown',
    },
    location: "Seattle, WA",
    rating: 4.5,
    reviews: 12,
    upvotes: 8,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 28,
      weeklyRate: 168
    },
    image: "https://images.unsplash.com/photo-1571333250630-f0230c320b6d?auto=format&fit=crop&q=80&w=800",
    description: "New to the platform! Offering secure bike transport solutions with foam protection and waterproof exterior. Perfect for both road and mountain bikes.",
    available: true,
    featured: false,
    bagSpecs: {
      brand: "Dakine",
      model: "BIKE ROLLER BAG",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: false
      },
      protectionLevel: 3,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 4,
      weight: {
        empty: 7.1,
        maxLoad: 20
      },
      dimensions: {
        length: 135,
        width: 30,
        height: 75
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "Lockable zippers",
        "Reinforced bottom"
      ]
    }
  },
  {
    id: 5,
    owner: {
      id: '5',
      firstName: 'Jennifer',
      lastName: 'Martinez',
    },
    location: "Austin, TX",
    rating: 4.6,
    reviews: 15,
    upvotes: 11,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 32,
      weeklyRate: 192
    },
    image: "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&q=80&w=800",
    description: "Recently added! Premium bike cases with built-in wheel protectors and frame padding. Includes complimentary insurance and 24/7 support.",
    available: true,
    featured: false,
    bagSpecs: {
      brand: "PRO",
      model: "MEGA BIKE BAG",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: false
      },
      protectionLevel: 4,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 3,
      weight: {
        empty: 7.9,
        maxLoad: 21
      },
      dimensions: {
        length: 130,
        width: 35,
        height: 85
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "Combination locks",
        "Reinforced handles",
        "ID card holder"
      ]
    }
  },
  {
    id: 6,
    owner: {
      id: '6',
      firstName: 'Alex',
      lastName: 'Chen',
    },
    location: "San Diego, CA",
    rating: 4.4,
    reviews: 8,
    upvotes: 6,
    pricingSchedule: {
      minimumDays: 1,
      dailyRate: 25,
      weeklyRate: 150
    },
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&q=80&w=800",
    description: "Just listed! Professional-grade bike transport cases. Easy to pack and transport, with reinforced corners and TSA-approved locks.",
    available: true,
    featured: false,
    bagSpecs: {
      brand: "Chain Reaction",
      model: "BIKE TRAVEL CASE",
      bikeCompatibility: {
        mountainBike: true,
        roadBike: true,
        hybridBike: true,
        ebike: false
      },
      protectionLevel: 3,
      wheelSize: {
        min: 26,
        max: 29
      },
      transportRating: 4,
      weight: {
        empty: 7.5,
        maxLoad: 20
      },
      dimensions: {
        length: 128,
        width: 32,
        height: 78
      },
      tsaCompliant: "Yes",
      securityFeatures: [
        "TSA-approved locks",
        "Water-resistant material"
      ]
    }
  }
];