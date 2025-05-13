
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import PDFViewer from '@/components/documents/PDFViewer';
import { NoteFrais, Dossier } from '@/types';
import { useData } from '@/contexts/DataContext';
import { generateNoteFraisPDF, downloadPDF } from '@/services/pdfService';

interface NotesFraisDownloadButtonProps {
  noteFraisId: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost';
  showPreview?: boolean;
}

const NotesFraisDownloadButton: React.FC<NotesFraisDownloadButtonProps> = ({
  noteFraisId,
  variant = 'outline',
  showPreview = true
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();
  const { notesFrais, getDossierById } = useData();
  
  // Trouver la note de frais correspondante
  const noteFrais = notesFrais.find(nf => nf.id === noteFraisId);
  const dossier = noteFrais ? getDossierById(noteFrais.dossierId) : null;
  
  // Générer ou récupérer le PDF
  const getPdfUrl = () => {
    if (noteFrais?.pdfUrl) {
      return noteFrais.pdfUrl;
    }
    
    if (noteFrais) {
      return generateNoteFraisPDF(noteFrais, dossier);
    }
    
    return '';
  };
  
  const handleDownload = () => {
    if (!noteFrais) {
      toast({
        title: "Erreur",
        description: "Note de frais non trouvée",
        variant: "destructive",
      });
      return;
    }
    
    const pdfData = getPdfUrl();
    const fileName = `note-frais-${noteFrais.id}.pdf`;
    
    downloadPDF(pdfData, fileName);
    
    toast({
      title: "Téléchargement lancé",
      description: "Le téléchargement du PDF a été lancé",
    });
  };
  
  if (!noteFrais) return null;
  
  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant={variant} 
          size="sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
        
        {showPreview && (
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Aperçu
          </Button>
        )}
      </div>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogTitle>
            Note de frais - {dossier?.operateurNom || 'Client'}
          </DialogTitle>
          <PDFViewer 
            pdfUrl={getPdfUrl()}
            fileName={`note-frais-${noteFrais.id}.pdf`}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotesFraisDownloadButton;
