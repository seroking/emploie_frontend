import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Home,
  BookOpen,
  Building,
  Menu,
  Building2,
  User,
  GraduationCap,
  CalendarRange,
  Users,
  CalendarDays,
  PieChart,
  DoorOpen,
  LogOut,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
   const handleLogout = async () => {
    try {
      await API.post("/logout"); // Token sera injecté via interceptor
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("jwt_token");
      navigate("/");
    }
  };

  const menuItems = [
    { label: "Accueil", to: "/", icon: <Home size={18} />, roles: [] },
    {
      label: "Année Scolaires",
      to: "/annees-scolaires",
      icon: <BookOpen size={18} />,
      roles: [],
    },
    {
      label: "Directions Régionales",
      to: "/directions-regionales",
      icon: <Building2 size={18} />,
      roles: [],
    },
    {
      label: "Complexes",
      to: "/complexes",
      icon: <Building size={18} />,
      roles: [],
    },
    {
      label: "Utilisateurs",
      to: "/users",
      icon: <User size={18} />,
      roles: [],
    },
    {
      label: "Formateurs",
      to: "/formateurs",
      icon: <GraduationCap size={18} />,
      roles: [],
    },
    {
      label: "Filières",
      to: "/filieres",
      icon: <GraduationCap size={18} />,
      roles: [],
    },
    {
      label: "Jours fériés",
      to: "/feries",
      icon: <CalendarRange size={18} />,
      roles: [],
    },
    {
      label: "Établissements",
      to: "/etablissements",
      icon: <Building size={18} />,
      roles: [],
    },
    {
      label: "Semaines",
      to: "/semaines",
      icon: <CalendarDays size={18} />,
      roles: [],
    },
    {
      label: "Secteurs",
      to: "/secteurs",
      icon: <PieChart size={18} />,
      roles: [],
    },
    {
      label: "Groupes",
      to: "/groupes",
      icon: <Users size={18} />,
      roles: [],
    },
    {
      label: "Salles",
      to: "/salles",
      icon: <DoorOpen size={18} />,
      roles: [],
    },
    {
      label: "Modules",
      to: "/modules",
      icon: <BookOpen size={18} />,
      roles: [],
    },
  ];

  return (
    <div
      className={`${
        open ? "w-60" : "w-16"
      } fixed left-0 top-0 h-full bg-gray-800 text-white p-4 z-50 transition-all duration-300 overflow-y-auto`}
    >
      <div className="flex items-center mb-6">
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
        {open && <span className="text-xl ms-1 font-bold">Gestion d'EDT</span>}
      </div>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-700 transition-colors ${
                location.pathname === item.to ? "bg-gray-700" : ""
              } ${!open ? "justify-center" : ""}`}
            >
              {item.icon}
              {open && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded text-white ${
            !open ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} />
          {open && <span>Déconnexion</span>}
        </button>
      </div>
    </div>    
  );
}
