
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentFieldsProps {
  documents: Array<{ name: string; file: File }>;
  onDocumentAdd: (file: File) => void;
  onDocumentRemove: (index: number) => void;
}

const DocumentFields = ({ documents, onDocumentAdd, onDocumentRemove }: DocumentFieldsProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onDocumentAdd(file);
      }
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="document" className="text-right font-medium text-sm">
          Pièces jointes
        </Label>
        <div className="col-span-3">
          <Input
            id="document"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF uniquement</p>
        </div>
      </div>

      {documents.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="col-start-2 col-span-3">
            <ul className="space-y-2">
              {documents.map((doc, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-certif-blue" />
                    <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => onDocumentRemove(index)}
                  >
                    <X size={16} className="text-gray-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFields;
