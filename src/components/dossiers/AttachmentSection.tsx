
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import PdfAttachment from './PdfAttachment';

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
      <div className="space-y-4 my-4">
        <Label className="text-sm font-medium">Pièces jointes (PDF)</Label>
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
