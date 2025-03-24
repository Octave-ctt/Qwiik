
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const RegisterForm: React.FC<{
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}> = ({ onClose, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name);
      if (onClose) onClose();
    } catch (error: any) {
      // La plupart des erreurs sont gérées dans le contexte Auth
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Créer un compte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nom complet
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">
            Confirmer le mot de passe
          </label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded-md"
            required
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full btn-primary py-2"
            disabled={isLoading}
          >
            {isLoading ? 'Création en cours...' : 'Créer un compte'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-qwiik-blue hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
