
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useAttachments() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  const handleAddAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
      
      if (pdfFiles.length !== newFiles.length) {
        toast({
          title: "Format non supporté",
          description: "Seuls les fichiers PDF sont acceptés",
          variant: "destructive",
        });
      }
      
      setAttachments(prev => [...prev, ...pdfFiles]);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const resetAttachments = () => {
    setAttachments([]);
  };

  return {
    attachments,
    handleAddAttachment,
    handleRemoveAttachment,
    resetAttachments
  };
}
