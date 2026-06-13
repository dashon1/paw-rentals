import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import PropertyCard from "../components/search/PropertyCard";
import { Heart, PawPrint } from "lucide-react";

export default function FavoritesPage() {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const userInstance = await base44.auth.me().catch(() => null);
      
      if (!userInstance) {
        setLoading(false);
        return;
      }

      setUser(userInstance);
      
      const userFavorites = await base44.entities.Favorite.filter({ user_email: userInstance.email });
      const favoriteIds = userFavorites.map(fav => fav.property_id);
      setFavorites(favoriteIds);

      if (favoriteIds.length > 0) {
        const allProperties = await base44.entities.Property.list();
        const favoriteProperties = allProperties.filter(prop => favoriteIds.includes(prop.id));
        setProperties(favoriteProperties);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setLoading(false);
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) return;

    const favorite = await base44.entities.Favorite.filter({
      user_email: user.email,
      property_id: propertyId
    });
    
    if (favorite.length > 0) {
      await base44.entities.Favorite.delete(favorite[0].id);
      setFavorites(prev => prev.filter(id => id !== propertyId));
      setProperties(prev => prev.filter(prop => prop.id !== propertyId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <PawPrint className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-3xl font-bold text-gray-900">My Favorite Properties</h1>
          </div>
          <p className="text-gray-600">
            Properties you've saved for later viewing
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-12 inline-block shadow-lg">
              <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No Favorites Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start browsing pet-friendly properties and save your favorites here!
              </p>
              <a 
                href="/Search"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <PawPrint className="w-5 h-5" />
                Browse Properties
              </a>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorited={true}
                onToggleFavorite={() => handleToggleFavorite(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}