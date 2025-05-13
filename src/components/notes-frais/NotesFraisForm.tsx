
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, FileUp, Banknote } from 'lucide-react';
import { Dossier, NoteFrais } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/hooks/useAuth';

interface NotesFraisFormProps {
  dossierId?: string;
  selectedDossier?: Dossier;
  onSuccess?: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({ 
  dossierId,
  selectedDossier,
  onSuccess 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNoteFrais, dossiers } = useData();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<Partial<NoteFrais>>({
    dossierId: dossierId || '',
    inspecteur_id: currentUser?.id || '',
    date: new Date().toISOString().split('T')[0],
    frais_gestion: 50000,
    frais_inspection: 75000,
    frais_analyses: 60000,
    frais_surveillance: 40000,
    status: 'en_attente',
    commentaire: '',
    description: '',
    montant: 0,
    notification_envoyee: false,
    operateur_notifie: false
  });
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'frais_gestion' || name === 'frais_inspection' || name === 'frais_analyses' || name === 'frais_surveillance') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier que tous les champs obligatoires sont remplis
    if (!formData.dossierId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un dossier.",
      });
      return;
    }

    // Calculer le montant total
    const total = 
      (formData.frais_gestion || 0) + 
      (formData.frais_inspection || 0) + 
      (formData.frais_analyses || 0) + 
      (formData.frais_surveillance || 0);
    
    // Simuler l'upload du fichier (dans une vraie application, cela serait fait vers un service de stockage)
    let fichier_url = '';
    if (uploadedFile) {
      // Dans une vraie application, nous téléchargerions le fichier vers un serveur
      // et obtiendrions une URL. Ici, nous simulons simplement cette URL
      fichier_url = `document-${Date.now()}-${uploadedFile.name}`;
    }

    addNoteFrais({
      dossierId: formData.dossierId,
      inspecteur_id: formData.inspecteur_id || currentUser?.id,
      date: formData.date || new Date().toISOString(),
      dateCreation: new Date().toISOString(),
      description: `Note de frais - ${new Date(formData.date || new Date()).toLocaleDateString()}`,
      montant: total,
      status: 'en_attente',
      acquitte: false,
      frais_gestion: formData.frais_gestion || 0,
      frais_inspection: formData.frais_inspection || 0,
      frais_analyses: formData.frais_analyses || 0,
      frais_surveillance: formData.frais_surveillance || 0,
      commentaire: formData.commentaire,
      fichier_url: fichier_url || undefined,
      notification_envoyee: false,
      operateur_notifie: false
    });
    
    toast({
      title: "Note de frais ajoutée",
      description: "La note de frais a été créée avec succès.",
    });
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/notes-frais');
    }
  };
  
  const handleCancel = () => {
    navigate('/notes-frais');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="dossierId">Dossier</Label>
        <div className="mt-1 relative">
          <Select
            value={formData.dossierId}
            onValueChange={(value) => setFormData({ ...formData, dossierId: value })}
            disabled={!!dossierId && !!selectedDossier}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un dossier" />
            </SelectTrigger>
            <SelectContent>
              {dossiers.map((dossier) => (
                <SelectItem key={dossier.id} value={dossier.id}>
                  {dossier.operateurNom} - {dossier.typeProduit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="date">Date</Label>
        <div className="mt-1 relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="inspecteurId">Inspecteur</Label>
        <div className="mt-1 relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input
            id="inspecteurId"
            name="inspecteurId"
            value={currentUser?.name || 'Inspecteur'}
            disabled
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frais_gestion">Frais de gestion (FCFA)</Label>
          <div className="mt-1 relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="frais_gestion"
              name="frais_gestion"
              type="number"
              value={formData.frais_gestion}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="frais_inspection">Frais d'inspection (FCFA)</Label>
          <div className="mt-1 relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="frais_inspection"
              name="frais_inspection"
              type="number"
              value={formData.frais_inspection}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="frais_analyses">Frais d'analyses (FCFA)</Label>
          <div className="mt-1 relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="frais_analyses"
              name="frais_analyses"
              type="number"
              value={formData.frais_analyses}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="frais_surveillance">Frais de surveillance (FCFA)</Label>
          <div className="mt-1 relative">
            <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              id="frais_surveillance"
              name="frais_surveillance"
              type="number"
              value={formData.frais_surveillance}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="commentaire">Commentaire</Label>
        <Textarea
          id="commentaire"
          name="commentaire"
          value={formData.commentaire}
          onChange={handleInputChange}
          className="h-24"
        />
      </div>
      
      <div>
        <Label htmlFor="document">Document</Label>
        <div className="mt-1">
          <div className="flex items-center">
            <input
              id="document"
              name="document"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="sr-only"
            />
            <label
              htmlFor="document"
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Choisir un fichier
            </label>
          </div>
          {uploadedFile && (
            <p className="mt-2 text-sm text-gray-500">
              Fichier sélectionné: {uploadedFile.name}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default NotesFraisForm;
