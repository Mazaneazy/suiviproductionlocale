
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check } from 'lucide-react';

interface ValidationActionsProps {
  onMarkComplet: () => void;
  onMarkRejected: () => void;
  disableComplete: boolean;
  disableReject: boolean;
}

const ValidationActions: React.FC<ValidationActionsProps> = ({
  onMarkComplet,
  onMarkRejected,
  disableComplete,
  disableReject
}) => {
  return (
    <div className="flex justify-end gap-3">
      <Button 
        variant="destructive" 
        onClick={onMarkRejected}
        disabled={disableReject}
      >
        <AlertCircle size={16} className="mr-2" /> 
        Marquer "À corriger"
      </Button>
      <Button 
        className="bg-certif-blue hover:bg-certif-blue/90"
        onClick={onMarkComplet}
        disabled={disableComplete}
      >
        <Check size={16} className="mr-2" /> 
        Valider et continuer
      </Button>
    </div>
  );
};

export default ValidationActions;
