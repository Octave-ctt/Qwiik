
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
  type?: 'login' | 'register'; // For backward compatibility
};

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
  type
}) => {
  // Use type as a fallback if initialView is not provided (for backward compatibility)
  const [view, setView] = useState<'login' | 'register'>(initialView || type || 'login');
  
  // Update view when initialView or type prop changes
  useEffect(() => {
    if (initialView) {
      setView(initialView);
    } else if (type) {
      setView(type);
    }
  }, [initialView, type]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-md animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {view === 'login' ? (
          <LoginForm
            onClose={onClose}
            onSwitchToRegister={() => setView('register')}
          />
        ) : (
          <RegisterForm
            onClose={onClose}
            onSwitchToLogin={() => setView('login')}
          />
        )}
      </div>
    </>
  );
};

export default AuthModal;
