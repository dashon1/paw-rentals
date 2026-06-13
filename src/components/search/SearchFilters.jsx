import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, MapPin, DollarSign, Home, PawPrint } from "lucide-react";

export default function SearchFilters({ filters, onFiltersChange, resultCount }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card className="sticky top-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-orange-500" />
          Search Filters
        </CardTitle>
        <p className="text-sm text-gray-600">{resultCount} properties found</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-orange-500" />
            City
          </Label>
          <Input
            placeholder="Enter city name"
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="border-orange-200 focus:border-orange-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-orange-500" />
            Max Monthly Rent
          </Label>
          <Input
            type="number"
            placeholder="e.g. 2000"
            value={filters.maxRent}
            onChange={(e) => handleFilterChange("maxRent", e.target.value)}
            className="border-orange-200 focus:border-orange-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Home className="w-4 h-4 text-orange-500" />
            Property Type
          </Label>
          <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
            <SelectTrigger className="border-orange-200 focus:border-orange-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Bedrooms</Label>
          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
            <SelectTrigger className="border-orange-200 focus:border-orange-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="0">Studio</SelectItem>
              <SelectItem value="1">1 Bedroom</SelectItem>
              <SelectItem value="2">2 Bedrooms</SelectItem>
              <SelectItem value="3">3 Bedrooms</SelectItem>
              <SelectItem value="4">4+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-6">
          <h4 className="flex items-center gap-2 font-medium mb-4">
            <PawPrint className="w-4 h-4 text-orange-500" />
            Pet Requirements
          </h4>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pet Type</Label>
              <Select value={filters.petType} onValueChange={(value) => handleFilterChange("petType", value)}>
                <SelectTrigger className="border-orange-200 focus:border-orange-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Dogs & Cats</SelectItem>
                  <SelectItem value="dogs">Dogs Only</SelectItem>
                  <SelectItem value="cats">Cats Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Max Pet Weight (lbs)</Label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={filters.maxWeight}
                onChange={(e) => handleFilterChange("maxWeight", e.target.value)}
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}