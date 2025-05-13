import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Acceuil from './pages/Acceuil';
import Dossiers from './pages/Dossiers';
import ResponsableTechnique from './pages/ResponsableTechnique';
import DirecteurEvaluation from './pages/DirecteurEvaluation';
import DirecteurGeneral from './pages/DirecteurGeneral';
import NotesFrais from './pages/NotesFrais';
import Statistiques from './pages/Statistiques';
import Profile from './pages/Profile';
import { useAuth } from './hooks/useAuth';

// Importation des nouvelles pages
import AddNoteFrais from './pages/AddNoteFrais';
import NoteFraisDetails from './pages/NoteFraisDetails';
import DossierDetails from './pages/DossierDetails';
import AddDossier from './pages/AddDossier';
import ProgrammerInspection from './pages/ProgrammerInspection';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:oobCode" element={<ResetPassword />} />
            <Route path="/" element={<ProtectedRoute><Acceuil /></ProtectedRoute>} />
            <Route path="/dossiers" element={<ProtectedRoute><Dossiers /></ProtectedRoute>} />
            <Route path="/responsable-technique" element={<ProtectedRoute><ResponsableTechnique /></ProtectedRoute>} />
            <Route path="/directeur-evaluation" element={<ProtectedRoute><DirecteurEvaluation /></ProtectedRoute>} />
            <Route path="/directeur-general" element={<ProtectedRoute><DirecteurGeneral /></ProtectedRoute>} />
            <Route path="/notes-frais" element={<ProtectedRoute><NotesFrais /></ProtectedRoute>} />
            <Route path="/statistiques" element={<ProtectedRoute><Statistiques /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Nouvelles routes pour remplacer les popups */}
            <Route path="/notes-frais/add" element={<ProtectedRoute><AddNoteFrais /></ProtectedRoute>} />
            <Route path="/notes-frais/add/:dossierId" element={<ProtectedRoute><AddNoteFrais /></ProtectedRoute>} />
            <Route path="/notes-frais/:noteId" element={<ProtectedRoute><NoteFraisDetails /></ProtectedRoute>} />
            <Route path="/dossiers/add" element={<ProtectedRoute><AddDossier /></ProtectedRoute>} />
            <Route path="/dossiers/:dossierId" element={<ProtectedRoute><DossierDetails /></ProtectedRoute>} />
            <Route path="/inspections/programmer/:dossierId" element={<ProtectedRoute><ProgrammerInspection /></ProtectedRoute>} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
