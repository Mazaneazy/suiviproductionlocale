
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentViewer from '../../document/DocumentViewer';
import { DocumentDossier } from '@/types';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';

interface DocumentViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentDossier | null;
}

const DocumentViewerDialog: React.FC<DocumentViewerDialogProps> = ({ 
  open, 
  onOpenChange, 
  document 
}) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] flex flex-col p-4 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-background'}`}>
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2">
            <Sun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
            <Switch 
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
            />
            <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {document && <DocumentViewer document={document} darkMode={darkMode} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerDialog;
