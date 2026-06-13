import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import SearchFilters from "../components/search/SearchFilters";
import PropertyCard from "../components/search/PropertyCard";
import FeaturedSection from "../components/search/FeaturedSection";
import HeroSection from "../components/search/HeroSection";

export default function SearchPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    maxRent: "",
    propertyType: "all",
    petType: "all",
    maxWeight: "",
    bedrooms: "all"
  });

  // Wrap applyFilters in useCallback to memoize it and prevent unnecessary re-creations
  const applyFilters = useCallback(() => {
    let filtered = properties.filter(property => {
      // City filter
      if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      
      // Max rent filter
      if (filters.maxRent && property.rent_price > parseInt(filters.maxRent)) {
        return false;
      }

      // Property type filter
      if (filters.propertyType !== "all" && property.property_type !== filters.propertyType) {
        return false;
      }

      // Pet type filter
      if (filters.petType === "dogs" && !property.pet_policy?.dogs_allowed) {
        return false;
      }
      if (filters.petType === "cats" && !property.pet_policy?.cats_allowed) {
        return false;
      }

      // Weight limit filter
      if (filters.maxWeight && property.pet_policy?.weight_limit && 
          parseInt(filters.maxWeight) > property.pet_policy.weight_limit) {
        return false;
      }

      // Bedrooms filter
      if (filters.bedrooms !== "all" && property.bedrooms !== parseInt(filters.bedrooms)) {
        return false;
      }

      return true;
    });

    setFilteredProperties(filtered);
  }, [filters, properties]); // Dependencies for useCallback

  useEffect(() => {
    loadData();
  }, []);

  // Use the memoized applyFilters as a dependency
  useEffect(() => {
    applyFilters();
  }, [applyFilters]); // Dependency for useEffect

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propertiesData, userInstance] = await Promise.all([
        base44.entities.Property.list("-created_date"),
        base44.auth.me().catch(() => null)
      ]);
      
      setProperties(propertiesData);
      setFilteredProperties(propertiesData); // Initial unfiltered set
      setUser(userInstance);

      if (userInstance) {
        const userFavorites = await base44.entities.Favorite.filter({ user_email: userInstance.email });
        setFavorites(userFavorites.map(fav => fav.property_id));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }

    const isFavorited = favorites.includes(propertyId);
    
    if (isFavorited) {
      const favorite = await base44.entities.Favorite.filter({ 
        user_email: user.email, 
        property_id: propertyId 
      });
      if (favorite.length > 0) {
        await base44.entities.Favorite.delete(favorite[0].id);
        setFavorites(prev => prev.filter(id => id !== propertyId));
      }
    } else {
      await base44.entities.Favorite.create({
        user_email: user.email,
        property_id: propertyId
      });
      setFavorites(prev => [...prev, propertyId]);
    }
  };

  const featuredProperties = properties.filter(p => p.is_featured).slice(0, 3);
  const regularProperties = filteredProperties.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {featuredProperties.length > 0 && (
          <FeaturedSection 
            properties={featuredProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8 mt-12">
          <div className="lg:w-80 flex-shrink-0">
            <SearchFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredProperties.length}
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProperties.length} Pet-Friendly Rentals
              </h2>
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-6 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : regularProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 inline-block shadow-lg">
                  <div className="text-6xl mb-4">🐾</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600">Try adjusting your search filters</p>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {regularProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorited={favorites.includes(property.id)}
                    onToggleFavorite={() => handleToggleFavorite(property.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}