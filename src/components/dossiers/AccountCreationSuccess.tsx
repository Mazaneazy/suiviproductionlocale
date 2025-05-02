
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AccountCreationSuccessProps {
  email: string;
  password: string;
  onClose: () => void;
}

const AccountCreationSuccess: React.FC<AccountCreationSuccessProps> = ({
  email,
  password,
  onClose
}) => {
  return (
    <>
      <div className="bg-green-50 border border-green-200 rounded-md p-4 my-4">
        <h3 className="font-semibold text-green-700 mb-2">Compte producteur créé</h3>
        <p className="text-sm text-green-600 mb-1">Email: <span className="font-mono">{email}</span></p>
        <p className="text-sm text-green-600">Mot de passe: <span className="font-mono">{password}</span></p>
        <p className="text-xs text-green-500 mt-2">Ces informations ont été communiquées au producteur.</p>
      </div>
      <DialogFooter>
        <Button onClick={onClose}>Fermer</Button>
      </DialogFooter>
    </>
  );
};

export default AccountCreationSuccess;
