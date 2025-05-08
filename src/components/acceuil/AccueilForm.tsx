
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Upload, X, CheckCircle, Save } from 'lucide-react';

interface DocumentUpload {
  type: 'registre_commerce' | 'carte_contribuable' | 'processus_production' | 'certificats_conformite' | 'liste_personnel' | 'plan_localisation';
  file: File | null;
  label: string;
  required: boolean;
}

const AccueilForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addDossier } = useData();
  
  const [entreprise, setEntreprise] = useState('');
  const [promoteur, setPromoteur] = useState('');
  const [telephone, setTelephone] = useState('');
  const [produits, setProduits] = useState('');
  
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { type: 'registre_commerce', file: null, label: 'Registre de Commerce', required: true },
    { type: 'carte_contribuable', file: null, label: 'Carte de Contribuable (NIU)', required: true },
    { type: 'processus_production', file: null, label: 'Schéma du processus de production', required: true },
    { type: 'certificats_conformite', file: null, label: 'Certificats de Conformité', required: false },
    { type: 'liste_personnel', file: null, label: 'Liste du personnel (sur papier entête)', required: true },
    { type: 'plan_localisation', file: null, label: 'Plan de localisation', required: true },
  ]);
  
  const fileInputRefs = {
    registre_commerce: useRef<HTMLInputElement>(null),
    carte_contribuable: useRef<HTMLInputElement>(null),
    processus_production: useRef<HTMLInputElement>(null),
    certificats_conformite: useRef<HTMLInputElement>(null),
    liste_personnel: useRef<HTMLInputElement>(null),
    plan_localisation: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0] || null;
    
    if (file && !file.type.includes('pdf')) {
      toast({
        variant: "destructive",
        title: "Format invalide",
        description: "Veuillez télécharger un fichier PDF uniquement.",
      });
      return;
    }
    
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file } : doc
    ));
  };

  const removeFile = (type: string) => {
    setDocuments(documents.map(doc => 
      doc.type === type ? { ...doc, file: null } : doc
    ));
    
    // Reset the file input
    const ref = fileInputRefs[type as keyof typeof fileInputRefs];
    if (ref.current) {
      ref.current.value = '';
    }
  };

  // Fonction pour créer un nouveau dossier à partir des données du formulaire
  const createDossierObject = () => {
    // Create document objects from files
    const documentObjects = documents
      .filter(doc => doc.file)
      .map(doc => ({
        id: Math.random().toString(36).substring(2, 11),
        dossierId: '',  // To be filled after dossier creation
        type: doc.type,
        nom: doc.file!.name,
        url: URL.createObjectURL(doc.file!),  // In a real app, this would be uploaded to a server
        dateUpload: new Date().toISOString(),
      }));
    
    // Create the dossier object
    return {
      operateurNom: entreprise,
      promoteurNom: promoteur,
      telephone,
      typeProduit: produits,
      dateTransmission: new Date().toISOString().split('T')[0],
      responsable: 'Responsable Technique',
      status: 'en_attente' as const,
      delai: 30,
      dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: documentObjects,
    };
  };
  
  // Nouvelle fonction pour enregistrer le dossier sans le transmettre
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation de base (uniquement l'entreprise est obligatoire pour l'enregistrement)
    if (!entreprise) {
      toast({
        variant: "destructive",
        title: "Champ obligatoire manquant",
        description: "Veuillez au moins saisir le nom de l'entreprise.",
      });
      return;
    }
    
    // Ajouter le dossier
    const newDossier = createDossierObject();
    addDossier(newDossier);
    
    toast({
      title: "Dossier enregistré",
      description: "Le dossier a été enregistré avec succès.",
    });
    
    // Reset form
    setEntreprise('');
    setPromoteur('');
    setTelephone('');
    setProduits('');
    setDocuments(documents.map(doc => ({ ...doc, file: null })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!entreprise || !promoteur || !telephone || !produits) {
      toast({
        variant: "destructive",
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }
    
    // Check required documents
    const missingDocuments = documents
      .filter(doc => doc.required && !doc.file)
      .map(doc => doc.label);
    
    if (missingDocuments.length > 0) {
      toast({
        variant: "destructive",
        title: "Documents manquants",
        description: `Veuillez télécharger les documents requis: ${missingDocuments.join(', ')}`,
      });
      return;
    }
    
    // Add the dossier
    const newDossier = createDossierObject();
    addDossier(newDossier);
    
    toast({
      title: "Dossier transmis",
      description: "Le dossier a été transmis au Responsable Technique avec succès.",
    });
    
    // Reset form
    setEntreprise('');
    setPromoteur('');
    setTelephone('');
    setProduits('');
    setDocuments(documents.map(doc => ({ ...doc, file: null })));
    
    navigate('/dossiers');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-certif-blue">Formulaire de réception des dossiers</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="entreprise">Nom de l'entreprise *</Label>
              <Input 
                id="entreprise"
                value={entreprise}
                onChange={(e) => setEntreprise(e.target.value)}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="promoteur">Nom du promoteur *</Label>
              <Input 
                id="promoteur"
                value={promoteur}
                onChange={(e) => setPromoteur(e.target.value)}
                placeholder="Nom du promoteur"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input 
                id="telephone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="produits">Produits à certifier *</Label>
              <Textarea 
                id="produits"
                value={produits}
                onChange={(e) => setProduits(e.target.value)}
                placeholder="Liste des produits à certifier"
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documents requis (format PDF)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.type} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={doc.type}>
                      {doc.label} {doc.required && <span className="text-red-500">*</span>}
                    </Label>
                    
                    {doc.file ? (
                      <div className="flex items-center">
                        <CheckCircle size={18} className="text-certif-green mr-2" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(doc.type)}
                          className="text-certif-red h-8 px-2"
                        >
                          <X size={18} />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  
                  {!doc.file ? (
                    <div>
                      <input 
                        type="file" 
                        id={doc.type} 
                        accept="application/pdf"
                        ref={fileInputRefs[doc.type as keyof typeof fileInputRefs]}
                        onChange={(e) => handleFileChange(e, doc.type)}
                        className="hidden" 
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRefs[doc.type as keyof typeof fileInputRefs].current?.click()}
                      >
                        <Upload size={18} className="mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  ) : (
                    <div className="text-sm truncate text-gray-600">{doc.file.name}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/dossiers')}>
            Annuler
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Save className="mr-2" size={16} />
            Enregistrer
          </Button>
          <Button type="submit" className="bg-certif-green hover:bg-certif-green/90">
            <PlusCircle className="mr-2" size={16} />
            Enregistrer et transmettre
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccueilForm;
