
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const AddressFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    zipCode: '',
    city: '',
    phoneNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.street || !formData.zipCode || !formData.city) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    
    // Save to localStorage (in a real app this would go to a database)
    localStorage.setItem('userAddress', JSON.stringify(formData));
    
    // Show success message
    toast({
      title: "Adresse enregistrée",
      description: "Votre adresse a été enregistrée avec succès.",
      variant: "default",
    });
    
    // Redirect back to account page
    navigate('/account');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Button 
        variant="outline" 
        onClick={() => navigate('/account')}
        className="mb-6"
      >
        Retour à mon compte
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Adresse de livraison</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nom complet *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Adresse *
              </label>
              <input
                id="street"
                name="street"
                type="text"
                value={formData.street}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                  Code postal *
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-md"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">
                  Ville *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-200 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                Numéro de téléphone
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Enregistrer mon adresse
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddressFormPage;
