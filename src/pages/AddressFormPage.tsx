
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const AddressFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    zipCode: '',
    state: 'France',
    name: '',
    phoneNumber: '',
  });

  useEffect(() => {
    // Check if there's saved address data in localStorage
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        setFormData(JSON.parse(savedAddress));
      } catch (e) {
        console.error("Error parsing saved address data", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save address to localStorage
    localStorage.setItem('userAddress', JSON.stringify(formData));
    
    // Show success toast
    toast({
      title: "Adresse enregistrée",
      description: "Votre adresse a été enregistrée avec succès.",
      variant: "success",
    });
    
    // Navigate back to account page
    navigate('/account');
  };

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Ajouter une adresse</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/account')}
          aria-label="Fermer"
        >
          <X size={24} />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            placeholder="Votre nom complet"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street">Adresse</Label>
          <Input
            id="street"
            name="street"
            placeholder="Numéro et nom de rue"
            value={formData.street}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">Code postal</Label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="Code postal"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Numéro de téléphone"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button type="submit" className="w-full">Enregistrer l'adresse</Button>
      </form>
    </div>
  );
};

export default AddressFormPage;
