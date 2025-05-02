
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Layout from '../components/Layout';
import { useToast } from '../hooks/use-toast';
import { Dossier } from '../types';
import AddDossierDialog from '../components/dossiers/AddDossierDialog';
import DossierFilters from '../components/dossiers/DossierFilters';
import DossiersTable from '../components/dossiers/DossiersTable';

const Dossiers = () => {
  const { dossiers, addDossier } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [latestDossierId, setLatestDossierId] = useState<string | undefined>(undefined);
  
  // État pour le nouveau dossier
  const [newDossier, setNewDossier] = useState<Omit<Dossier, 'id'>>({
    operateurNom: '',
    promoteurNom: '',
    telephone: '',
    typeProduit: '',
    responsable: 'Gestionnaire',
    dateTransmission: new Date().toISOString().split('T')[0],
    status: 'en_attente',
    delai: 30,
    dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    historique: [],
  });

  // Filtrer les dossiers en fonction des critères de recherche
  const filteredDossiers = dossiers.filter(dossier => {
    const matchesSearch = 
      dossier.operateurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.typeProduit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.responsable.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'tous' || dossier.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  console.log("Total dossiers:", dossiers.length);
  console.log("Filtered dossiers:", filteredDossiers.length);

  // Check if company name already exists
  const companyNameExists = (name: string): boolean => {
    return dossiers.some(dossier => 
      dossier.operateurNom.toLowerCase() === name.toLowerCase()
    );
  };

  // Fonction pour ajouter un nouveau dossier
  const handleAddDossier = () => {
    // Check for duplicate company name
    if (companyNameExists(newDossier.operateurNom)) {
      toast({
        title: "Erreur",
        description: `Une entreprise avec le nom "${newDossier.operateurNom}" existe déjà.`,
        variant: "destructive"
      });
      return;
    }
    
    // Make sure historique is initialized
    const dossierToAdd = {
      ...newDossier,
      historique: newDossier.historique || []
    };
    
    addDossier(dossierToAdd);
    
    // Récupérer l'ID du dossier qui vient d'être créé
    setTimeout(() => {
      try {
        const storedDossiers = JSON.parse(localStorage.getItem('dossiers') || '[]');
        if (storedDossiers.length > 0) {
          const createdDossierId = storedDossiers[storedDossiers.length - 1].id;
          setLatestDossierId(createdDossierId);
          console.log("ID du dossier créé:", createdDossierId);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'ID du dossier:", error);
      }
    }, 100);
    
    toast({
      title: "Dossier ajouté",
      description: `Le dossier pour "${newDossier.operateurNom}" a été créé avec succès.`,
    });
  };

  // Utiliser un effet pour réinitialiser le formulaire après l'ajout d'un dossier
  useEffect(() => {
    // Si le dialogue est fermé et un ID de dossier a été généré, réinitialiser le formulaire
    if (!dialogOpen && latestDossierId) {
      setNewDossier({
        operateurNom: '',
        promoteurNom: '',
        telephone: '',
        typeProduit: '',
        responsable: 'Gestionnaire',
        dateTransmission: new Date().toISOString().split('T')[0],
        status: 'en_attente',
        delai: 30,
        dateButoir: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        historique: [],
      });
      
      // Garder l'ID du dernier dossier créé pour traiter les pièces jointes
      // Mais ne le réinitialiser que lors d'une nouvelle ouverture du dialogue
    }
  }, [dialogOpen, latestDossierId]);

  // Réinitialiser l'ID du dossier quand on ouvre le dialogue
  const handleOpenDialog = (open: boolean) => {
    if (open) {
      setLatestDossierId(undefined);
    }
    setDialogOpen(open);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-certif-blue">Transmission dossiers</h1>
        <AddDossierDialog
          open={dialogOpen}
          onOpenChange={handleOpenDialog}
          newDossier={newDossier}
          setNewDossier={setNewDossier}
          onSubmit={handleAddDossier}
          latestDossierId={latestDossierId}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <DossierFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <DossiersTable dossiers={filteredDossiers} />
      </div>
    </Layout>
  );
};

export default Dossiers;
