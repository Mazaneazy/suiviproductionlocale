
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DocumentViewer from '../../document/DocumentViewer';
import { DocumentDossier } from '@/types';
import { Moon, Sun } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      // Small delay for the fade-in animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`max-w-4xl max-h-[90vh] flex flex-col p-4 transition-all duration-300 
          ${darkMode ? 'bg-gray-900 text-white' : 'bg-background'}
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2">
            <Sun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
            <Switch 
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Basculer mode sombre"
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
