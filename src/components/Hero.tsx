import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';

const heroImages = [
  'https://images.unsplash.com/photo-1623954360656-c259d5be39cf?auto=format&fit=crop&q=80&w=2000', // Mountain biker with bike bag
  'https://images.unsplash.com/photo-1583722276033-c34139bf5ae0?auto=format&fit=crop&q=80&w=2000', // Adventure cyclist in mountains
  'https://images.unsplash.com/photo-1635174813757-4b8b5ef6bc64?auto=format&fit=crop&q=80&w=2000', // Bike packing scenic route
  'https://images.unsplash.com/photo-1565109698955-9673d41c88c2?auto=format&fit=crop&q=80&w=2000', // Mountain trail adventure
  'https://images.unsplash.com/photo-1506710507565-203b9f24669b?auto=format&fit=crop&q=80&w=2000', // Epic mountain vista with bike
];

const Hero: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setCurrentImageIndex(randomIndex);
    
    document.documentElement.style.setProperty(
      '--hero-image',
      `url("${heroImages[randomIndex]}")`
    );
  }, []);

  return (
    <div className="hero-pattern">
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Your Bike's Perfect
            <br />
            Travel Companion
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            It's not only about the destination but also the journey. Traveling the world with your bike and mates is now more common than ever before.
          </p>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Adventures to the most exotic riding destinations around the globe require a bike case that is going to get your prized possession there and back both easily and unscathed with a minimum of fuss and airline charges.
          </p>
          <SearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
};

export default Hero;