
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
  darkMode?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, darkMode = false }) => {
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
    <div className={`flex flex-col h-full transition-colors duration-300 ${darkMode ? 'text-white' : ''}`}>
      <DocumentViewerToolbar 
        document={document}
        zoom={zoom}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        darkMode={darkMode}
      />

      <Tabs 
        defaultValue="preview" 
        className="flex-1 flex flex-col" 
        value={activeTab} 
        onValueChange={setActiveTab}
      >
        <TabsList className={`mb-2 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <TabsTrigger 
            value="preview"
            className={`transition-all duration-300 ${darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}`}
          >
            Aperçu
          </TabsTrigger>
          <TabsTrigger 
            value="details"
            className={`transition-all duration-300 ${darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}`}
          >
            Détails
          </TabsTrigger>
          <TabsTrigger 
            value="annotations" 
            className={`flex items-center gap-1 transition-all duration-300 ${darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}`}
          >
            <PenLine className="h-4 w-4" />
            Annotations
          </TabsTrigger>
          <TabsTrigger 
            value="comments" 
            className={`flex items-center gap-1 transition-all duration-300 ${darkMode ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white' : ''}`}
          >
            <MessageSquare className="h-4 w-4" />
            Commentaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 animate-in fade-in duration-300">
          <DocumentPreviewTab 
            document={document}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            zoom={zoom}
            rotation={rotation}
            activeTab={activeTab}
            darkMode={darkMode}
          />
        </TabsContent>

        <TabsContent value="details" className="animate-in fade-in duration-300">
          <DocumentDetailsTab document={document} darkMode={darkMode} />
        </TabsContent>
        
        <TabsContent value="annotations" className="animate-in fade-in duration-300">
          <DocumentAnnotationsTab setActiveTab={setActiveTab} darkMode={darkMode} />
        </TabsContent>
        
        <TabsContent value="comments" className="animate-in fade-in duration-300">
          <DocumentComments documentId={document.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentViewer;
