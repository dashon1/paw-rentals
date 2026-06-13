import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Mail, LogOut, Save } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    preferences: {
      pet_types: [],
      max_budget: "",
      preferred_locations: ""
    }
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const userInstance = await base44.auth.me();
      setUser(userInstance);
      setFormData({
        full_name: userInstance.full_name || "",
        phone: userInstance.phone || "",
        preferences: userInstance.preferences || {
          pet_types: [],
          max_budget: "",
          preferred_locations: ""
        }
      });
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('preferences.')) {
      const prefField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await base44.auth.updateMe(formData);
      alert("Profile updated successfully!");
      loadUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
    setIsUpdating(false);
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await base44.auth.redirectToLogin();
    } catch (error) {
      console.error("Error logging in:", error);
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
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center p-8">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardContent className="text-center p-8">
            <UserIcon className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to PawRentals</h2>
            <p className="text-gray-600 mb-8">Sign in to save favorites and manage your account</p>
            <Button 
              onClick={handleLogin}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserIcon className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          </div>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {user.full_name || "Pet Owner"}
                </h3>
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        placeholder="Your full name"
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

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Search Preferences</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="max_budget">Maximum Budget</Label>
                        <Input
                          id="max_budget"
                          type="number"
                          value={formData.preferences.max_budget}
                          onChange={(e) => handleInputChange("preferences.max_budget", e.target.value)}
                          placeholder="2000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferred_locations">Preferred Locations</Label>
                        <Input
                          id="preferred_locations"
                          value={formData.preferences.preferred_locations}
                          onChange={(e) => handleInputChange("preferences.preferred_locations", e.target.value)}
                          placeholder="New York, Los Angeles, Chicago"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}