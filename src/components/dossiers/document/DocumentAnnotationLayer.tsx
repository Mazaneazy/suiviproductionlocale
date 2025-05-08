
import React, { useState, useEffect } from 'react';
import { PencilRuler, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface DocumentAnnotationLayerProps {
  documentId: string;
}

const DocumentAnnotationLayer: React.FC<DocumentAnnotationLayerProps> = ({ documentId }) => {
  const { toast } = useToast();
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ff0000');

  // Charger les annotations existantes
  useEffect(() => {
    const loadAnnotations = () => {
      try {
        const savedAnnotations = localStorage.getItem(`annotations_${documentId}`);
        if (savedAnnotations) {
          setAnnotations(JSON.parse(savedAnnotations));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des annotations:', error);
      }
    };
    
    loadAnnotations();
  }, [documentId]);

  // Sauvegarder les annotations
  useEffect(() => {
    if (annotations.length > 0) {
      localStorage.setItem(`annotations_${documentId}`, JSON.stringify(annotations));
    }
  }, [annotations, documentId]);

  // Fonction pour ajouter une annotation
  const handleAddAnnotation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    
    // Calculer la position relative au conteneur
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newAnnotation: Annotation = {
      id: `anno_${Date.now()}`,
      x,
      y,
      text: 'Annotation',
      color: currentColor,
    };
    
    setAnnotations([...annotations, newAnnotation]);
    toast({
      title: "Annotation ajoutée",
      description: "L'annotation a été ajoutée au document"
    });
  };
  
  // Supprimer une annotation
  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(anno => anno.id !== id));
    toast({
      title: "Annotation supprimée",
      description: "L'annotation a été supprimée du document"
    });
  };

  // Couleurs disponibles
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

  return (
    <div 
      className="absolute inset-0 bg-transparent z-10" 
      onClick={handleAddAnnotation}
      style={{ pointerEvents: isDrawing ? 'auto' : 'none' }}
    >
      {/* Toolbar pour les annotations */}
      <div 
        className="absolute top-2 right-2 bg-white p-2 rounded shadow-md flex items-center gap-2"
        style={{ pointerEvents: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button 
          variant={isDrawing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsDrawing(!isDrawing)}
          className="flex items-center gap-1"
        >
          <PencilRuler size={14} />
          {isDrawing ? "Arrêter" : "Annoter"}
        </Button>
        
        {isDrawing && (
          <div className="flex items-center gap-1">
            {colors.map(color => (
              <button
                key={color}
                className={`w-4 h-4 rounded-full ${currentColor === color ? 'ring-2 ring-offset-1' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Afficher les annotations */}
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${annotation.x}%`,
            top: `${annotation.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
        >
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            style={{ backgroundColor: annotation.color }}
          >
            <span>!</span>
          </div>
          <button 
            className="absolute -top-2 -right-2 text-gray-800 bg-white rounded-full"
            onClick={() => removeAnnotation(annotation.id)}
          >
            <XCircle size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default DocumentAnnotationLayer;
