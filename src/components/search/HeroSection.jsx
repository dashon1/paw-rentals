import React from "react";
import { Search, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-400">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-white rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <Search className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-white/90">Pet-Friendly Home</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover rental properties that welcome your furry family members with transparent pet policies and caring landlords.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/80"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>Nationwide Listings</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>Pet-Friendly Verified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-12 text-orange-50">
          <path fill="currentColor" d="M0,96L1440,32L1440,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
}