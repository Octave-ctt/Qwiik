
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les nouveaux mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would verify the current password and update it in the backend
    // For this demo, we'll just simulate success
    
    // Show success message
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès.",
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
          <CardTitle>Changer mon mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                Mot de passe actuel
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md"
                required
              />
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full sm:w-auto">
                Mettre à jour mon mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
