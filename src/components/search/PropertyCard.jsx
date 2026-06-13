import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, PawPrint, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PropertyCard({ property, isFavorited, onToggleFavorite }) {
  const petPolicy = property.pet_policy || {};
  const mainImage = property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <Button
              variant={isFavorited ? "default" : "outline"}
              size="icon"
              onClick={onToggleFavorite}
              className={`rounded-full shadow-lg transition-all duration-200 ${
                isFavorited 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </Button>
          </div>
          {property.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.city}, {property.state}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.bathrooms}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-bold text-xl text-green-600">
                  ${property.rent_price.toLocaleString()}
                </span>
                <span className="text-gray-500 text-sm">/mo</span>
              </div>
            </div>

            {/* Pet Policy Summary */}
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <PawPrint className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Pet Policy</span>
              </div>
              <div className="space-y-1 text-sm">
                {petPolicy.dogs_allowed && petPolicy.cats_allowed ? (
                  <p className="text-green-700">✓ Dogs & Cats Welcome</p>
                ) : petPolicy.dogs_allowed ? (
                  <p className="text-green-700">✓ Dogs Welcome</p>
                ) : petPolicy.cats_allowed ? (
                  <p className="text-green-700">✓ Cats Welcome</p>
                ) : (
                  <p className="text-gray-600">Pet policy varies</p>
                )}
                {petPolicy.pet_deposit > 0 && (
                  <p className="text-gray-600">Deposit: ${petPolicy.pet_deposit}</p>
                )}
                {petPolicy.weight_limit && (
                  <p className="text-gray-600">Max weight: {petPolicy.weight_limit} lbs</p>
                )}
              </div>
            </div>

            <Link to={createPageUrl(`PropertyDetails?id=${property.id}`)} className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                View Details
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}