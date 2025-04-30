
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dossier } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface NotesFraisFormProps {
  dossier: Dossier;
  onNoteFraisCreated: () => void;
}

const NotesFraisForm: React.FC<NotesFraisFormProps> = ({ dossier, onNoteFraisCreated }) => {
  const { addNoteFrais } = useData();
  const { currentUser } = useAuth();
  
  const [noteFrais, setNoteFrais] = useState({
    fraisGestion: 50000,
    fraisInspection: 100000,
    fraisAnalyses: 75000,
    fraisSurveillance: 60000,
    commentaire: '',
  });
  
  const [total, setTotal] = useState(0);
  
  // Calcul du total
  useEffect(() => {
    const calculatedTotal = 
      (noteFrais.fraisGestion || 0) + 
      (noteFrais.fraisInspection || 0) + 
      (noteFrais.fraisAnalyses || 0) + 
      (noteFrais.fraisSurveillance || 0);
    
    setTotal(calculatedTotal);
  }, [noteFrais]);
  
  // Mettre à jour les valeurs de la note de frais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'commentaire') {
      setNoteFrais({ ...noteFrais, commentaire: value });
    } else {
      const numValue = value === '' ? 0 : parseInt(value);
      setNoteFrais({ ...noteFrais, [name]: numValue });
    }
  };
  
  // Soumettre la note de frais
  const handleSubmit = () => {
    if (!currentUser) return;
    
    addNoteFrais({
      dossierId: dossier.id,
      inspecteurId: currentUser.id,
      dateCreation: new Date().toISOString().split('T')[0],
      deplacement: 0,
      hebergement: 0,
      restauration: 0,
      indemnites: 0,
      fraisGestion: noteFrais.fraisGestion,
      fraisInspection: noteFrais.fraisInspection,
      fraisAnalyses: noteFrais.fraisAnalyses,
      fraisSurveillance: noteFrais.fraisSurveillance,
      total: total,
      status: 'en_attente',
      commentaire: noteFrais.commentaire || undefined,
    });
    
    onNoteFraisCreated();
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Détails du dossier</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Opérateur:</span>
                  <p className="font-medium">{dossier.operateurNom}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Produit:</span>
                  <p>{dossier.typeProduit}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Paramètres à évaluer:</span>
                  <ul className="list-disc list-inside text-sm pl-2">
                    {dossier.parametresEvaluation?.map((param, index) => (
                      <li key={index}>{param}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fraisGestion">Frais de gestion (FCFA)</Label>
              <Input
                id="fraisGestion"
                name="fraisGestion"
                type="number"
                value={noteFrais.fraisGestion}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fraisInspection">Inspection et échantillonnage (FCFA)</Label>
              <Input
                id="fraisInspection"
                name="fraisInspection"
                type="number"
                value={noteFrais.fraisInspection}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fraisAnalyses">Analyses et essais (FCFA)</Label>
              <Input
                id="fraisAnalyses"
                name="fraisAnalyses"
                type="number"
                value={noteFrais.fraisAnalyses}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fraisSurveillance">Surveillance (FCFA)</Label>
              <Input
                id="fraisSurveillance"
                name="fraisSurveillance"
                type="number"
                value={noteFrais.fraisSurveillance}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">{total.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="commentaire">Commentaires</Label>
        <Textarea
          id="commentaire"
          name="commentaire"
          value={noteFrais.commentaire}
          onChange={handleChange}
          placeholder="Ajouter des commentaires ou instructions spécifiques"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          className="bg-certif-blue hover:bg-certif-blue/90"
          onClick={handleSubmit}
        >
          Transmettre la note de frais au Directeur
        </Button>
      </div>
    </div>
  );
};

export default NotesFraisForm;
