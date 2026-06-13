import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, PawPrint, Home, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PostListingPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    rent_price: "",
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    description: "",
    available_date: "",
    // Pet policy
    pets_allowed: true,
    dogs_allowed: true,
    cats_allowed: true,
    max_pets: "",
    weight_limit: "",
    pet_deposit: "",
    monthly_pet_fee: "",
    breed_restrictions: "",
    pet_notes: "",
    // Contact info
    landlord_name: "",
    phone: "",
    email: "",
    // Amenities
    amenities: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = await base44.auth.me().catch(() => null);
      
      const propertyData = {
        title: formData.title,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        rent_price: parseFloat(formData.rent_price),
        property_type: formData.property_type,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
        square_feet: parseInt(formData.square_feet) || null,
        description: formData.description,
        available_date: formData.available_date || new Date().toISOString().split('T')[0],
        amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"], // Default image
        pet_policy: {
          pets_allowed: formData.pets_allowed,
          dogs_allowed: formData.dogs_allowed,
          cats_allowed: formData.cats_allowed,
          max_pets: parseInt(formData.max_pets) || null,
          weight_limit: parseInt(formData.weight_limit) || null,
          pet_deposit: parseFloat(formData.pet_deposit) || 0,
          monthly_pet_fee: parseFloat(formData.monthly_pet_fee) || 0,
          breed_restrictions: formData.breed_restrictions ? 
            formData.breed_restrictions.split(',').map(b => b.trim()).filter(Boolean) : [],
          pet_notes: formData.pet_notes
        },
        contact_info: {
          landlord_name: formData.landlord_name,
          phone: formData.phone,
          email: formData.email || user?.email
        },
        is_featured: false
      };

      await base44.entities.Property.create(propertyData);
      navigate(createPageUrl("Search"));
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Error creating listing. Please try again.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Plus className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">Post Pet-Friendly Listing</h1>
          </div>
          <p className="text-gray-600">
            List your property and welcome pet owners to their new home
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Property Info */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-orange-500" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g. Beautiful 2BR Apartment"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => handleInputChange("property_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="NY"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                    placeholder="1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={(e) => handleInputChange("square_feet", e.target.value)}
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your property..."
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => handleInputChange("amenities", e.target.value)}
                  placeholder="Pool, Gym, Parking, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Availability */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Pricing & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rent_price">Monthly Rent *</Label>
                  <Input
                    id="rent_price"
                    type="number"
                    min="0"
                    value={formData.rent_price}
                    onChange={(e) => handleInputChange("rent_price", e.target.value)}
                    placeholder="2000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available_date">Available Date</Label>
                  <Input
                    id="available_date"
                    type="date"
                    value={formData.available_date}
                    onChange={(e) => handleInputChange("available_date", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pet Policy */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-orange-500" />
                Pet Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pets_allowed"
                  checked={formData.pets_allowed}
                  onCheckedChange={(checked) => handleInputChange("pets_allowed", checked)}
                />
                <Label htmlFor="pets_allowed">Pets Allowed</Label>
              </div>

              {formData.pets_allowed && (
                <div className="space-y-4 pl-6 border-l-2 border-orange-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dogs_allowed"
                        checked={formData.dogs_allowed}
                        onCheckedChange={(checked) => handleInputChange("dogs_allowed", checked)}
                      />
                      <Label htmlFor="dogs_allowed">Dogs Allowed</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cats_allowed"
                        checked={formData.cats_allowed}
                        onCheckedChange={(checked) => handleInputChange("cats_allowed", checked)}
                      />
                      <Label htmlFor="cats_allowed">Cats Allowed</Label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_pets">Maximum Pets</Label>
                      <Input
                        id="max_pets"
                        type="number"
                        min="1"
                        value={formData.max_pets}
                        onChange={(e) => handleInputChange("max_pets", e.target.value)}
                        placeholder="2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight_limit">Weight Limit (lbs)</Label>
                      <Input
                        id="weight_limit"
                        type="number"
                        min="0"
                        value={formData.weight_limit}
                        onChange={(e) => handleInputChange("weight_limit", e.target.value)}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pet_deposit">Pet Deposit</Label>
                      <Input
                        id="pet_deposit"
                        type="number"
                        min="0"
                        value={formData.pet_deposit}
                        onChange={(e) => handleInputChange("pet_deposit", e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthly_pet_fee">Monthly Pet Fee</Label>
                      <Input
                        id="monthly_pet_fee"
                        type="number"
                        min="0"
                        value={formData.monthly_pet_fee}
                        onChange={(e) => handleInputChange("monthly_pet_fee", e.target.value)}
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="breed_restrictions">Breed Restrictions (comma-separated)</Label>
                    <Input
                      id="breed_restrictions"
                      value={formData.breed_restrictions}
                      onChange={(e) => handleInputChange("breed_restrictions", e.target.value)}
                      placeholder="Pit Bull, Rottweiler, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pet_notes">Additional Pet Notes</Label>
                    <Textarea
                      id="pet_notes"
                      value={formData.pet_notes}
                      onChange={(e) => handleInputChange("pet_notes", e.target.value)}
                      placeholder="Any additional pet policy information..."
                      className="h-20"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landlord_name">Your Name</Label>
                  <Input
                    id="landlord_name"
                    value={formData.landlord_name}
                    onChange={(e) => handleInputChange("landlord_name", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Search"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSubmitting ? "Creating Listing..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}