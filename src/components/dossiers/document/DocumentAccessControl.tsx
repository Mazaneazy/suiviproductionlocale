
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DocumentDossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

interface DocumentAccessControlProps {
  document: DocumentDossier;
}

const DocumentAccessControl: React.FC<DocumentAccessControlProps> = ({ document }) => {
  const { hasRole, currentUser } = useAuth();
  const { updateDocument } = useData();
  const { toast } = useToast();

  // Accès basé sur le rôle
  const isAdmin = hasRole(['admin', 'directeur_general']);
  const isResponsableTechnique = hasRole(['responsable_technique']);
  
  // Chargé de clientèle peut maintenant voir la liste des documents
  const canViewDocuments = hasRole(['acceuil', 'responsable_technique', 'chef_mission', 'directeur', 'directeur_general', 'gestionnaire']);
  
  // Seuls les responsables techniques et administrateurs peuvent modifier l'accès
  const canManageAccess = isAdmin || isResponsableTechnique;
  
  const handleToggleAccess = () => {
    if (!canManageAccess) return;
    
    const newAccessStatus = document.accessiblePublic ? false : true;
    
    updateDocument(document.id, {
      accessiblePublic: newAccessStatus
    });
    
    toast({
      title: newAccessStatus ? "Document rendu public" : "Document rendu privé",
      description: newAccessStatus 
        ? "Le document est maintenant accessible au chargé de clientèle" 
        : "Le document est maintenant accessible uniquement au personnel technique",
    });
  };
  
  if (!canManageAccess) return null;
  
  return (
    <div className="mt-4">
      <Button 
        variant="outline"
        size="sm"
        onClick={handleToggleAccess}
        className={document.accessiblePublic ? "text-green-600" : "text-gray-500"}
      >
        {document.accessiblePublic ? (
          <>
            <Shield className="h-4 w-4 mr-1" />
            Document public
          </>
        ) : (
          <>
            <ShieldOff className="h-4 w-4 mr-1" />
            Document privé
          </>
        )}
      </Button>
      <p className="text-xs text-gray-500 mt-1">
        {document.accessiblePublic 
          ? "Ce document est visible par le chargé de clientèle" 
          : "Ce document n'est pas visible par le chargé de clientèle"}
      </p>
    </div>
  );
};

export default DocumentAccessControl;
