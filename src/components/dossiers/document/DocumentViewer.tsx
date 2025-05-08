
import React, { useState } from 'react';
import { DocumentDossier } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, PenLine } from 'lucide-react';

// Import the extracted components
import DocumentViewerToolbar from './DocumentViewerToolbar';
import DocumentPreviewTab from './tabs/DocumentPreviewTab';
import DocumentDetailsTab from './tabs/DocumentDetailsTab';
import DocumentAnnotationsTab from './tabs/DocumentAnnotationsTab';
import DocumentComments from './DocumentComments';

interface DocumentViewerProps {
  document: DocumentDossier;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('preview');

  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
  };

  return (
    <div className="flex flex-col h-full">
      <DocumentViewerToolbar 
        document={document}
        zoom={zoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
      />

      <Tabs defaultValue="preview" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="annotations" className="flex items-center gap-1">
            <PenLine className="h-4 w-4" />
            Annotations
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Commentaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1">
          <DocumentPreviewTab 
            document={document}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            zoom={zoom}
            rotation={rotation}
            activeTab={activeTab}
          />
        </TabsContent>

        <TabsContent value="details">
          <DocumentDetailsTab document={document} />
        </TabsContent>
        
        <TabsContent value="annotations">
          <DocumentAnnotationsTab setActiveTab={setActiveTab} />
        </TabsContent>
        
        <TabsContent value="comments">
          <DocumentComments documentId={document.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;
