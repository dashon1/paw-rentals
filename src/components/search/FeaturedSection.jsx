import React from "react";
import { Star } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function FeaturedSection({ properties, favorites, onToggleFavorite }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
          <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorited={favorites.includes(property.id)}
            onToggleFavorite={() => onToggleFavorite(property.id)}
          />
        ))}
      </div>
    </div>
  );
}