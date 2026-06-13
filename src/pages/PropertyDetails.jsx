import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, MapPin, Bed, Bath, Square, PawPrint, DollarSign, Phone, Mail, Calendar, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      const [propertyData, userInstance] = await Promise.all([
        base44.entities.Property.filter({ id: propertyId }),
        base44.auth.me().catch(() => null)
      ]);

      if (propertyData.length > 0) {
        setProperty(propertyData[0]);
        setUser(userInstance);

        // Load reviews
        const reviewsData = await base44.entities.Review.filter({ property_id: propertyId });
        setReviews(reviewsData);
        
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length;
          setAverageRating(avg);
        }

        if (userInstance) {
          const favorites = await base44.entities.Favorite.filter({
            user_email: userInstance.email,
            property_id: propertyId
          });
          setIsFavorited(favorites.length > 0);
        }
      }
    } catch (error) {
      console.error("Error loading property:", error);
    }
    setLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }

    if (isFavorited) {
      const favorite = await base44.entities.Favorite.filter({
        user_email: user.email,
        property_id: property.id
      });
      if (favorite.length > 0) {
        await base44.entities.Favorite.delete(favorite[0].id);
        setIsFavorited(false);
      }
    } else {
      await base44.entities.Favorite.create({
        user_email: user.email,
        property_id: property.id
      });
      setIsFavorited(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <Link to={createPageUrl("Search")}>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Back to Search
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const petPolicy = property.pet_policy || {};
  const contactInfo = property.contact_info || {};

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to={createPageUrl("Search")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
          </Link>
          
          <Button
            variant={isFavorited ? "default" : "outline"}
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 ${
              isFavorited 
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            {isFavorited ? "Saved" : "Save Property"}
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96">
            <img
              src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"}
              alt={property.title}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {property.images?.slice(1, 5).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-44 object-cover rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{property.address}, {property.city}, {property.state}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {averageRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                        <span className="font-bold">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">({reviews.length})</span>
                      </div>
                    )}
                    {property.is_featured && (
                      <Badge className="bg-orange-500 text-white border-0">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-8">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-500" />
                    <span className="text-lg">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-gray-500" />
                    <span className="text-lg">{property.bathrooms} Bathrooms</span>
                  </div>
                  {property.square_feet && (
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-gray-500" />
                      <span className="text-lg">{property.square_feet.toLocaleString()} sq ft</span>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description || "No description available."}
                  </p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pet Policy */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="w-6 h-6 text-orange-500" />
                  Pet Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Dogs Allowed:</span>
                      <Badge variant={petPolicy.dogs_allowed ? "default" : "secondary"}>
                        {petPolicy.dogs_allowed ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cats Allowed:</span>
                      <Badge variant={petPolicy.cats_allowed ? "default" : "secondary"}>
                        {petPolicy.cats_allowed ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {petPolicy.max_pets && (
                      <div className="flex justify-between items-center">
                        <span>Max Pets:</span>
                        <span className="font-medium">{petPolicy.max_pets}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {petPolicy.weight_limit && (
                      <div className="flex justify-between items-center">
                        <span>Weight Limit:</span>
                        <span className="font-medium">{petPolicy.weight_limit} lbs</span>
                      </div>
                    )}
                    {petPolicy.pet_deposit > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Pet Deposit:</span>
                        <span className="font-medium">${petPolicy.pet_deposit}</span>
                      </div>
                    )}
                    {petPolicy.monthly_pet_fee > 0 && (
                      <div className="flex justify-between items-center">
                        <span>Monthly Pet Fee:</span>
                        <span className="font-medium">${petPolicy.monthly_pet_fee}/mo</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {petPolicy.breed_restrictions && petPolicy.breed_restrictions.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Breed Restrictions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {petPolicy.breed_restrictions.map((breed, index) => (
                        <Badge key={index} variant="outline">
                          {breed}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {petPolicy.pet_notes && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Additional Pet Information:</h4>
                    <p className="text-gray-700">{petPolicy.pet_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <span className="text-4xl font-bold text-green-600">
                      ${property.rent_price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600">per month</p>
                </div>

                {property.available_date && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Available: {new Date(property.available_date).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Contact Landlord</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactInfo.landlord_name && (
                    <div>
                      <p className="font-medium text-gray-900">{contactInfo.landlord_name}</p>
                    </div>
                  )}
                  
                  {contactInfo.phone && (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => window.open(`tel:${contactInfo.phone}`)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {contactInfo.phone}
                    </Button>
                  )}
                  
                  {contactInfo.email && (
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => window.open(`mailto:${contactInfo.email}?subject=Inquiry about ${property.title}`)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Card */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  {averageRating > 0 ? (
                    <>
                      <div className="text-4xl font-bold text-orange-500 mb-2">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.round(averageRating)
                                ? 'fill-orange-500 text-orange-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{reviews.length} reviews</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No reviews yet</p>
                  )}
                </div>
                <Link to={createPageUrl(`Reviews?property_id=${property.id}`)}>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {reviews.length > 0 ? 'View All Reviews' : 'Be the First to Review'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}