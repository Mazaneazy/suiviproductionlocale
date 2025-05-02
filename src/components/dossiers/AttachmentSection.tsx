
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PdfAttachment from './PdfAttachment';
import { Paperclip } from 'lucide-react';

interface AttachmentSectionProps {
  attachments: File[];
  createAccount: boolean;
  onAddAttachment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (index: number) => void;
  onCreateAccountToggle: () => void;
}

const AttachmentSection: React.FC<AttachmentSectionProps> = ({
  attachments,
  createAccount,
  onAddAttachment,
  onRemoveAttachment,
  onCreateAccountToggle
}) => {
  return (
    <>
      <div className="space-y-2 my-4 border rounded-md p-4 bg-gray-50">
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-certif-blue" />
          <Label className="text-lg font-medium text-certif-blue">Pièces jointes du dossier</Label>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          Téléversez tous les documents nécessaires à l'évaluation du dossier (RCCM, NIU, schéma de production, etc.)
        </p>
        
        <PdfAttachment 
          attachments={attachments} 
          onAddAttachment={onAddAttachment} 
          onRemoveAttachment={onRemoveAttachment} 
        />
      </div>
      
      <div className="flex items-center space-x-2 my-4">
        <Checkbox 
          id="create-account" 
          checked={createAccount} 
          onCheckedChange={onCreateAccountToggle} 
        />
        <label
          htmlFor="create-account"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Créer un compte producteur
        </label>
      </div>
    </>
  );
};

export default AttachmentSection;
