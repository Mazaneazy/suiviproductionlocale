
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Upload, X, CheckCircle, Save } from 'lucide-react';
import { useAccueilForm } from '@/hooks/useAccueilForm';

const AccueilForm = () => {
  const navigate = useNavigate();
  
  const {
    entreprise, setEntreprise,
    promoteur, setPromoteur,
    telephone, setTelephone,
    produits, setProduits,
    documents, setDocuments,
    fileInputRefs,
    validated, setValidated,
    handleFileChange,
    removeFile,
    validateForm,
    handleFinalSubmit
  } = useAccueilForm();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-certif-blue">Formulaire de réception des dossiers</CardTitle>
      </CardHeader>
      <form onSubmit={handleFinalSubmit}>
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
                disabled={validated}
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
                disabled={validated}
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
                disabled={validated}
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
                disabled={validated}
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
                        {!validated && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(doc.type)}
                            className="text-certif-red h-8 px-2"
                          >
                            <X size={18} />
                          </Button>
                        )}
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
                        disabled={validated}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRefs[doc.type as keyof typeof fileInputRefs].current?.click()}
                        disabled={validated}
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

          {!validated ? (
            <div className="flex justify-center pt-4">
              <Button 
                type="button" 
                onClick={validateForm} 
                variant="secondary"
                className="w-full max-w-xs"
              >
                <Save className="mr-2" size={16} />
                Valider le dossier
              </Button>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-green-50 border border-certif-green rounded-md">
              <p className="text-certif-green flex items-center">
                <CheckCircle className="mr-2" size={16} />
                Dossier validé avec succès. Vous pouvez maintenant transmettre ce dossier.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/dossiers')}>
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="bg-certif-green hover:bg-certif-green/90"
            disabled={!validated}
          >
            <PlusCircle className="mr-2" size={16} />
            Enregistrer et transmettre
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AccueilForm;
