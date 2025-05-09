import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Calendar, Mail, User, Phone, Building } from 'lucide-react';
import { User as UserType } from '../types';
import { Helmet } from 'react-helmet';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { getUserById } = useAuth();

  const user = getUserById(userId as string);

  if (!user) {
    return (
      <Layout>
        <Helmet>
          <title>Utilisateur non trouvé | ANOR Certification</title>
        </Helmet>
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h1>
          <Button onClick={() => navigate('/user-management')}>
            Retour à la liste des utilisateurs
          </Button>
        </div>
      </Layout>
    );
  }

  const roleLabels: Record<string, string> = {
    'admin': 'Administrateur',
    'acceuil': 'Poste d\'Accueil',
    'inspecteur': 'Chef des Inspections',
    'analyste': 'Chargé du reporting',
    'surveillant': 'Agent de surveillance',
    'comptable': 'Responsable Notes de Frais',
    'directeur': 'Directeur Evaluation Conformité',
    'responsable_technique': 'Responsable Technique',
    'chef_mission': 'Chef de Mission d\'Inspection',
    'certificats': 'Délivrance des Certificats',
    'directeur_general': 'Directeur Général ANOR',
    'gestionnaire': 'Gestionnaire des Dossiers',
    'producteur': 'Producteur Local'
  };

  const statusLabel = user.email ? "Actif" : "Inactif";

  return (
    <Layout>
      <Helmet>
        <title>{user.name} | Détails | ANOR Certification</title>
      </Helmet>
      <div className="container mx-auto py-10">
        <Button variant="ghost" onClick={() => navigate('/user-management')} className="mb-4">
          Retour à la liste des utilisateurs
        </Button>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Détails de l'utilisateur</CardTitle>
            <CardDescription>Informations détaillées sur l'utilisateur sélectionné</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-2xl bg-gray-500 text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium">Nom:</p>
              </div>
              <p>{user.name}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium">Email:</p>
              </div>
              <p>{user.email || 'N/A'}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium">Date de création:</p>
              </div>
              <p>{user.dateCreation ? new Date(user.dateCreation).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium">Téléphone:</p>
              </div>
              <p>{user.phone || 'N/A'}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium">Rôle:</p>
              </div>
              <p>{roleLabels[user.role] || user.role}</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm font-medium">Statut:</p>
              <Badge variant="secondary" className="bg-green-500 text-white">
                {statusLabel}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UserDetails;
