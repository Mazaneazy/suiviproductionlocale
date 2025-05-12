
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl: string;
  fileName?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, fileName = 'document.pdf' }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded-t-md">
        <div className="text-sm font-medium">{fileName}</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-200 p-4 flex justify-center">
        <div 
          className="bg-white shadow-lg"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease'
          }}
        >
          <iframe 
            src={pdfUrl} 
            className="w-[800px] h-[600px]" 
            title="Document PDF"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
