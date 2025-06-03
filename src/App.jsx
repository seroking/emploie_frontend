import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";

// CRUD pages imports
import IndexAnneeScolaire from "./pages/AnneeScolaire/Index";
import CreateAnneeScolaire from "./pages/AnneeScolaire/Create";
import EditAnneeScolaire from "./pages/AnneeScolaire/Edit";
import IndexDirectionRegional from "./pages/DirectionRegional/Index";
import CreateDirectionRegional from "./pages/DirectionRegional/Create";
import EditDirectionRegional from "./pages/DirectionRegional/Edit";
import IndexComplexe from "./pages/Complexe/Index";
import CreateComplexe from "./pages/Complexe/Create";
import EditComplexe from "./pages/Complexe/Edit";
import IndexFormateur from "./pages/Formateur/Index";
import CreateFormateur from "./pages/Formateur/Create";
import EditFormateur from "./pages/Formateur/Edit";
import IndexUser from "./pages/User/Index";
import CreateUser from "./pages/User/Create";
import EditUser from "./pages/User/Edit";
import IndexFiliere from "./pages/Filiere/Index";
import CreateFiliere from "./pages/Filiere/Create";
import EditFiliere from "./pages/Filiere/Edit";
import IndexFerie from "./pages/Ferie/Index";
import CreateFerie from "./pages/Ferie/Create";
import EditFerie from "./pages/Ferie/Edit";
import IndexEtablissement from "./pages/Etablissement/Index";
import CreateEtablissement from "./pages/Etablissement/Create";
import EditEtablissement from "./pages/Etablissement/Edit";
import IndexGroupe from "./pages/Groupe/Index";
import CreateGroupe from "./pages/Groupe/Create";
import EditGroupe from "./pages/Groupe/Edit";
import IndexSemaine from "./pages/Semaine/Index";
import CreateSemaine from "./pages/Semaine/Create";
import EditSemaine from "./pages/Semaine/Edit";
import IndexSecteur from "./pages/Secteur/Index";
import CreateSecteur from "./pages/Secteur/Create";
import EditSecteur from "./pages/Secteur/Edit";
import IndexSalle from "./pages/Salle/Index";
import CreateSalle from "./pages/Salle/Create";
import EditSalle from "./pages/Salle/Edit";
import IndexModule from "./pages/Module/Index";
import CreateModule from "./pages/Module/Create";
import EditModule from "./pages/Module/Edit";

function AppLayout({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}>
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />

            {/* AnneeScolaire */}
            <Route path="/annees-scolaires" element={<IndexAnneeScolaire />} />
            <Route path="/annees-scolaires/create" element={<CreateAnneeScolaire />} />
            <Route path="/annees-scolaires/edit/:id" element={<EditAnneeScolaire />} />

            {/* DirectionRegional */}
            <Route path="/directions-regionales" element={<IndexDirectionRegional />} />
            <Route path="/directions-regionales/create" element={<CreateDirectionRegional />} />
            <Route path="/directions-regionales/edit/:id" element={<EditDirectionRegional />} />

            {/* Complexe */}
            <Route path="/complexes" element={<IndexComplexe />} />
            <Route path="/complexes/create" element={<CreateComplexe />} />
            <Route path="/complexes/edit/:id" element={<EditComplexe />} />

            {/* Formateur */}
            <Route path="/formateurs" element={<IndexFormateur />} />
            <Route path="/formateurs/create" element={<CreateFormateur />} />
            <Route path="/formateurs/edit/:id" element={<EditFormateur />} />

            {/* User */}
            <Route path="/utilisateurs" element={<IndexUser />} />
            <Route path="/utilisateurs/create" element={<CreateUser />} />
            <Route path="/utilisateurs/edit/:id" element={<EditUser />} />

            {/* Filiere */}
            <Route path="/filieres" element={<IndexFiliere />} />
            <Route path="/filieres/create" element={<CreateFiliere />} />
            <Route path="/filieres/edit/:id" element={<EditFiliere />} />

            {/* Ferie */}
            <Route path="/feries" element={<IndexFerie />} />
            <Route path="/feries/create" element={<CreateFerie />} />
            <Route path="/feries/edit/:id" element={<EditFerie />} />

            {/* Etablissement */}
            <Route path="/etablissements" element={<IndexEtablissement />} />
            <Route path="/etablissements/create" element={<CreateEtablissement />} />
            <Route path="/etablissements/edit/:id" element={<EditEtablissement />} />

            {/* Groupe */}
            <Route path="/groupes" element={<IndexGroupe />} />
            <Route path="/groupes/create" element={<CreateGroupe />} />
            <Route path="/groupes/edit/:id" element={<EditGroupe />} />

            {/* Semaine */}
            <Route path="/semaines" element={<IndexSemaine />} />
            <Route path="/semaines/create" element={<CreateSemaine />} />
            <Route path="/semaines/edit/:id" element={<EditSemaine />} />

            {/* Secteur */}
            <Route path="/secteurs" element={<IndexSecteur />} />
            <Route path="/secteurs/create" element={<CreateSecteur />} />
            <Route path="/secteurs/edit/:id" element={<EditSecteur />} />

            {/* Salle */}
            <Route path="/salles" element={<IndexSalle />} />
            <Route path="/salles/create" element={<CreateSalle />} />
            <Route path="/salles/edit/:id" element={<EditSalle />} />

            {/* Module */}
            <Route path="/modules" element={<IndexModule />} />
            <Route path="/modules/create" element={<CreateModule />} />
            <Route path="/modules/edit/:id" element={<EditModule />} />

            {/* Default redirect within layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const allowedRoles = [
    "DirecteurEtablissement",
    "DirecteurSuper",
    "DirecteurRegional",
    "DirecteurComplexe",
  ];

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route at root */}
          <Route path="/" element={<Login />} />

          {/* Protected App Routes */}
          <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
            <Route
              path="/*"
              element={<AppLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
            />
          </Route>

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />

          {/* Redirect all other routes to root (login) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
