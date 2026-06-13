import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PawPrint, Plus, Edit, Trash2, Heart, Award, Syringe } from "lucide-react";

export default function PetProfilesPage() {
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    pet_name: "",
    pet_type: "dog",
    breed: "",
    age: "",
    weight: "",
    color: "",
    gender: "male",
    spayed_neutered: false,
    behavior_notes: "",
    training: []
  });
  
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userInstance = await base44.auth.me().catch(() => null);
    setUser(userInstance);
  };

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['petProfiles', user?.email],
    queryFn: () => base44.entities.PetProfile.filter({ owner_email: user.email }, '-created_date'),
    enabled: !!user?.email
  });

  const createPetMutation = useMutation({
    mutationFn: (petData) => base44.entities.PetProfile.create(petData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petProfiles'] });
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PetProfile.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petProfiles'] });
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deletePetMutation = useMutation({
    mutationFn: (id) => base44.entities.PetProfile.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petProfiles'] });
    }
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const petData = {
      ...formData,
      owner_email: user.email,
      age: parseFloat(formData.age) || 0,
      weight: parseFloat(formData.weight) || 0
    };

    if (editingPet) {
      updatePetMutation.mutate({ id: editingPet.id, data: petData });
    } else {
      createPetMutation.mutate(petData);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      pet_name: pet.pet_name || "",
      pet_type: pet.pet_type || "dog",
      breed: pet.breed || "",
      age: pet.age || "",
      weight: pet.weight || "",
      color: pet.color || "",
      gender: pet.gender || "male",
      spayed_neutered: pet.spayed_neutered || false,
      behavior_notes: pet.behavior_notes || "",
      training: pet.training || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this pet profile?")) {
      deletePetMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      pet_name: "",
      pet_type: "dog",
      breed: "",
      age: "",
      weight: "",
      color: "",
      gender: "male",
      spayed_neutered: false,
      behavior_notes: "",
      training: []
    });
    setEditingPet(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <PawPrint className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to manage pet profiles</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <PawPrint className="w-8 h-8 text-orange-500" />
              My Pet Profiles
            </h1>
            <p className="text-gray-600 mt-2">
              Create detailed profiles for your furry family members
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? 'Edit Pet Profile' : 'Create Pet Profile'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Pet Name *</Label>
                    <Input
                      value={formData.pet_name}
                      onChange={(e) => handleInputChange('pet_name', e.target.value)}
                      placeholder="e.g. Max"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pet Type *</Label>
                    <Select
                      value={formData.pet_type}
                      onValueChange={(value) => handleInputChange('pet_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Breed</Label>
                    <Input
                      value={formData.breed}
                      onChange={(e) => handleInputChange('breed', e.target.value)}
                      placeholder="e.g. Golden Retriever"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color/Markings</Label>
                    <Input
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="e.g. Golden"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Age (years)</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="5"
                      step="0.5"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (lbs)</Label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="50"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spayed_neutered"
                    checked={formData.spayed_neutered}
                    onCheckedChange={(checked) => handleInputChange('spayed_neutered', checked)}
                  />
                  <Label htmlFor="spayed_neutered">Spayed/Neutered</Label>
                </div>

                <div className="space-y-2">
                  <Label>Behavior Notes</Label>
                  <Textarea
                    value={formData.behavior_notes}
                    onChange={(e) => handleInputChange('behavior_notes', e.target.value)}
                    placeholder="Describe your pet's personality, behavior, and any special needs..."
                    className="h-24"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    {editingPet ? 'Update Pet' : 'Create Pet'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : pets.length === 0 ? (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-12 text-center">
              <PawPrint className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Pet Profiles Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create profiles for your pets to include in rental applications
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                        <PawPrint className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{pet.pet_name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {pet.pet_type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(pet)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(pet.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {pet.breed && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600">Breed:</span>
                        <span className="font-medium">{pet.breed}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {pet.age > 0 && (
                        <div>
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium ml-2">{pet.age} yrs</span>
                        </div>
                      )}
                      {pet.weight > 0 && (
                        <div>
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium ml-2">{pet.weight} lbs</span>
                        </div>
                      )}
                      {pet.gender && (
                        <div>
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium ml-2 capitalize">{pet.gender}</span>
                        </div>
                      )}
                      {pet.color && (
                        <div>
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium ml-2">{pet.color}</span>
                        </div>
                      )}
                    </div>

                    {pet.spayed_neutered && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Syringe className="w-4 h-4" />
                        <span>Spayed/Neutered</span>
                      </div>
                    )}

                    {pet.behavior_notes && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {pet.behavior_notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}