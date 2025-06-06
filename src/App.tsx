
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dossiers from "./pages/Dossiers";
import AddDossier from "./pages/AddDossier";
import Inspections from "./pages/Inspections";
import AddInspection from "./pages/AddInspection";
import Calendar from "./pages/Calendar";
import Certificats from "./pages/Certificats";
import NotesFrais from "./pages/NotesFrais";
import Accueil from "./pages/Accueil";
import ResponsableTechnique from "./pages/ResponsableTechnique";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Statistiques from "./pages/Statistiques";
import UserManagement from "./pages/UserManagement";
import UserDetails from "./pages/UserDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/dossiers" element={
                <ProtectedRoute>
                  <Dossiers />
                </ProtectedRoute>
              } />
              
              <Route path="/ajouter-dossier" element={
                <ProtectedRoute>
                  <AddDossier />
                </ProtectedRoute>
              } />

              <Route path="/accueil" element={
                <ProtectedRoute moduleName="acceuil">
                  <Accueil />
                </ProtectedRoute>
              } />

              <Route path="/responsable-technique" element={
                <ProtectedRoute moduleName="responsable-technique">
                  <ResponsableTechnique />
                </ProtectedRoute>
              } />

              <Route path="/inspections" element={
                <ProtectedRoute moduleName="inspections">
                  <Inspections />
                </ProtectedRoute>
              } />
              
              <Route path="/ajouter-inspection" element={
                <ProtectedRoute moduleName="inspections">
                  <AddInspection />
                </ProtectedRoute>
              } />
              
              <Route path="/ajouter-inspection/:dossierId" element={
                <ProtectedRoute moduleName="inspections">
                  <AddInspection />
                </ProtectedRoute>
              } />

              <Route path="/calendar" element={
                <ProtectedRoute moduleName="inspections">
                  <Calendar />
                </ProtectedRoute>
              } />

              <Route path="/certificats" element={
                <ProtectedRoute moduleName="resultats">
                  <Certificats />
                </ProtectedRoute>
              } />
              
              <Route path="/notes-frais" element={
                <ProtectedRoute moduleName="notes-frais">
                  <NotesFrais />
                </ProtectedRoute>
              } />

              <Route path="/resultats" element={
                <ProtectedRoute moduleName="resultats">
                  <Certificats />
                </ProtectedRoute>
              } />

              <Route path="/statistiques" element={
                <ProtectedRoute moduleName="statistiques">
                  <Statistiques />
                </ProtectedRoute>
              } />

              <Route path="/user-management" element={
                <ProtectedRoute moduleName="user-management">
                  <UserManagement />
                </ProtectedRoute>
              } />

              <Route path="/user-details/:userId" element={
                <ProtectedRoute moduleName="user-management">
                  <UserDetails />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
