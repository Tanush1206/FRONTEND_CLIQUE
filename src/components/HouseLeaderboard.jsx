import React, { useState, useEffect } from 'react';

// Live data will provide: [{ houseId, name, color, totalPoints }]

// Use public URLs for house images (Vite handles these correctly)
const logoSrcByName = {
  PHOENIX: '/house/Screenshot_2025-09-22_at_7.16.54_PM-removebg-preview.png', 
  TUSKER: '/house/Screenshot_2025-09-22_at_7.17.33_PM-removebg-preview.png', // Elephant
  LEO: '/house/Screenshot_2025-09-22_at_7.17.47_PM-removebg-preview.png', // Lion
  KONG: '/house/Screenshot_2025-09-22_at_7.17.18_PM-removebg-preview.png', // Gorilla
};

function Logo3D({ src, alt, sizeClass }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (x - 0.5) * 25; 
    const rotateX = (0.5 - y) * 25; 
    setTilt({ x: rotateX, y: rotateY });
  };

  const onEnter = () => setIsHovered(true);
  const onLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative inline-flex items-center justify-center ${sizeClass} cursor-pointer`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glow effect background */}
      <div
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(255,165,0,0.4) 0%, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: isHovered ? 0.8 : 0,
        }}
      />
      
      {/* Main logo */}
      <img
        src={src}
        alt={alt}
        className="relative object-contain transition-all duration-200 ease-out"
        style={{
          transform: `
            perspective(800px) 
            rotateX(${tilt.x}deg) 
            rotateY(${tilt.y}deg) 
            translateZ(${isHovered ? '30px' : '0px'})
            scale(${isHovered ? 1.1 : 1})
          `,
          filter: `
            drop-shadow(0 15px 35px rgba(0,0,0,0.6))
            drop-shadow(0 5px 15px rgba(255,165,0,0.3))
            ${isHovered ? 'brightness(1.2)' : 'brightness(1)'}
          `,
          width: '100%',
          height: '100%',
        }}
      />
      
      {/* Reflection effect */}
      <img
        src={src}
        alt={`${alt} reflection`}
        className="absolute object-contain pointer-events-none"
        style={{
          transform: `
            perspective(800px) 
            rotateX(${tilt.x}deg) 
            rotateY(${tilt.y}deg) 
            translateZ(${isHovered ? '25px' : '-5px'})
            scaleY(-0.3)
            translateY(120%)
            scale(${isHovered ? 1.1 : 1})
          `,
          filter: 'blur(1px)',
          opacity: 0.2,
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

const HouseLeaderboard = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/leaderboard');
        const data = await response.json();
        
        if (data.success && data.leaderboard) {
          // Map totalPoints to points for consistency
          const formattedHouses = data.leaderboard.map(house => ({
            _id: house._id,
            name: house.name,
            points: house.totalPoints || 0,
            color: house.color
          }));
          setHouses(formattedHouses);
        } else {
          setError('Failed to fetch leaderboard');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center overflow-hidden min-h-[70vh] w-full">
        <div className="text-white/80 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400 mb-4"></div>
          <p className="text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex items-center justify-center overflow-hidden min-h-[70vh] w-full">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-2">{error}</p>
          <p className="text-sm text-white/60">Make sure the backend server is running on port 4000</p>
        </div>
      </div>
    );
  }

  if (houses.length < 4) {
    return (
      <div className="relative flex items-center justify-center overflow-hidden min-h-[70vh] w-full">
        <div className="text-white/80 text-center">
          <p className="text-xl mb-2">Not enough houses to display leaderboard</p>
          <p className="text-sm text-white/60">Run: npm run seed:houses in the BACKEND folder</p>
        </div>
      </div>
    );
  }
  
  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);
  const podiumOrder = [sortedHouses[1], sortedHouses[0], sortedHouses[2]]; // 2nd, 1st, 3rd for podium display

  return (
    <div className="relative flex items-center justify-center overflow-hidden min-h-[70vh] w-full">
      {/* Background particles/stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex items-end justify-center space-x-12">
        {/* 2nd Place */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <div className="mb-6">
            <Logo3D 
              src={logoSrcByName[podiumOrder[0].name]} 
              alt={podiumOrder[0].name} 
              sizeClass="w-32 h-32" 
            />
          </div>
           <div className="bg-gradient-to-br from-white/20 to-gray-200/20 backdrop-blur-2xl h-36 w-36 rounded-t-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex items-end justify-center pb-4 border border-white/30 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-gray-600/20 to-transparent" />
             <span className="text-5xl font-bold text-white relative z-10 drop-shadow-lg">2</span>
           </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white tracking-wider">{podiumOrder[0].name}</h3>
            <p className="text-orange-400 font-semibold text-lg">{podiumOrder[0].points.toLocaleString()} pts</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <div className="mb-8">
            <Logo3D 
              src={logoSrcByName[podiumOrder[1].name]} 
              alt={podiumOrder[1].name} 
              sizeClass="w-40 h-40" 
            />
          </div>
           <div className="bg-gradient-to-br from-orange-500/25 to-red-600/25 backdrop-blur-2xl h-48 w-36 rounded-t-xl shadow-[0_15px_50px_rgba(0,0,0,0.3)] flex items-end justify-center pb-6 border border-orange-400/40 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 to-transparent" />
             <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
               <div className="w-8 h-8 bg-orange-400/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-orange-300/50">
                 <div className="w-4 h-4 bg-orange-300/60 rounded-full" />
               </div>
             </div>
             <span className="text-6xl font-bold text-white relative z-10 drop-shadow-lg">1</span>
           </div>
          <div className="mt-6">
            <h3 className="text-2xl font-bold text-white tracking-wider">{podiumOrder[1].name}</h3>
            <p className="text-orange-400 font-semibold text-xl">{podiumOrder[1].points.toLocaleString()} pts</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="text-center transform hover:scale-105 transition-transform duration-300">
          <div className="mb-6">
            <Logo3D 
              src={logoSrcByName[podiumOrder[2].name]} 
              alt={podiumOrder[2].name} 
              sizeClass="w-32 h-32" 
            />
          </div>
           <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-2xl h-28 w-36 rounded-t-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex items-end justify-center pb-4 border border-yellow-400/30 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/15 to-transparent" />
             <span className="text-4xl font-bold text-white relative z-10 drop-shadow-lg">3</span>
           </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white tracking-wider">{podiumOrder[2].name}</h3>
            <p className="text-orange-400 font-semibold text-lg">{podiumOrder[2].points.toLocaleString()} pts</p>
          </div>
        </div>
      </div>

       {/* 4th Place (Side display) */}
       <div className="absolute top-1/2 -translate-y-1/2 right-8 text-center transform hover:scale-110 transition-all duration-300">
         <div className="mb-4">
           <Logo3D 
             src={logoSrcByName[sortedHouses[3].name]} 
             alt={sortedHouses[3].name} 
             sizeClass="w-24 h-24" 
           />
         </div>
         <div className="bg-gradient-to-br from-gray-500/20 to-gray-700/20 backdrop-blur-2xl px-4 py-3 rounded-xl border border-gray-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
           <div className="flex items-center justify-center w-6 h-6 bg-gray-500/30 backdrop-blur-xl rounded-full mx-auto mb-2 border border-gray-400/40">
             <span className="text-xs font-bold text-white">4</span>
           </div>
           <h3 className="text-base font-bold text-white tracking-wider">{sortedHouses[3].name}</h3>
           <p className="text-orange-400 font-semibold text-sm">{sortedHouses[3].points.toLocaleString()} pts</p>
         </div>
       </div>
    </div>
  );
};

export default HouseLeaderboard;