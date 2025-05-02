
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useInspectionForm = (dossierId: string) => {
  const { addInspection, updateDossier, getDossierById } = useData();
  const { toast } = useToast();
  const { getAllUsers } = useAuth();
  
  const dossier = getDossierById(dossierId);
  const allUsers = getAllUsers();
  
  // Filtrer les inspecteurs (utilisateurs avec le rôle inspecteur, surveillant ou chef_mission)
  const inspecteurs = allUsers
    .filter(user => ['inspecteur', 'surveillant', 'chef_mission'].includes(user.role))
    .map(user => ({
      value: user.name,
      label: user.name
    }));

  const [formData, setFormData] = useState({
    dossierId: dossierId,
    dateInspection: '',
    lieu: '',
    inspecteurs: [''],
    notes: '',
  });
  
  useEffect(() => {
    // Si des inspecteurs sont disponibles, initialiser avec le premier
    if (inspecteurs.length > 0) {
      setFormData(prev => ({
        ...prev,
        inspecteurs: [inspecteurs[0].value]
      }));
    }
    
    // Définir la date par défaut à demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({
      ...prev,
      dateInspection: tomorrow.toISOString().split('T')[0]
    }));
  }, [inspecteurs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInspecteurChange = (index: number, value: string) => {
    const newInspecteurs = [...formData.inspecteurs];
    newInspecteurs[index] = value;
    setFormData({
      ...formData,
      inspecteurs: newInspecteurs,
    });
  };

  const addInspecteur = () => {
    // Make sure we don't add duplicate inspectors
    const availableInspecteurs = inspecteurs.filter(
      insp => !formData.inspecteurs.includes(insp.value)
    );
    
    if (availableInspecteurs.length > 0) {
      setFormData({
        ...formData,
        inspecteurs: [...formData.inspecteurs, availableInspecteurs[0].value],
      });
    }
  };

  const removeInspecteur = (index: number) => {
    if (formData.inspecteurs.length > 1) {
      const newInspecteurs = formData.inspecteurs.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        inspecteurs: newInspecteurs,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de base
    if (!formData.dateInspection || !formData.lieu || formData.inspecteurs.length === 0) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez remplir tous les champs requis.',
        variant: 'destructive',
      });
      return;
    }

    // Vérifier que la date est dans le futur
    const inspectionDate = new Date(formData.dateInspection);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inspectionDate < today) {
      toast({
        title: 'Date invalide',
        description: 'La date d\'inspection doit être aujourd\'hui ou dans le futur.',
        variant: 'destructive',
      });
      return;
    }

    // Ajouter l'inspection au dossier
    addInspection({
      ...formData,
      dateInspection: formData.dateInspection,
      resultat: 'en_attente',
    });

    // Mettre à jour le statut du dossier si nécessaire
    if (dossier && dossier.status === 'complet') {
      updateDossier(dossierId, { status: 'en_cours' });
    }

    toast({
      title: 'Inspection programmée',
      description: `L'inspection a été programmée pour le ${new Date(formData.dateInspection).toLocaleDateString()}.`,
    });

    // Réinitialiser le formulaire
    setFormData({
      dossierId: dossierId,
      dateInspection: formData.dateInspection,
      lieu: '',
      inspecteurs: [formData.inspecteurs[0]],
      notes: '',
    });
  };

  return {
    formData,
    inspecteurs,
    handleChange,
    handleInspecteurChange,
    addInspecteur,
    removeInspecteur,
    handleSubmit,
  };
};
