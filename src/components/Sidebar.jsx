import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import API from "../services/api";
import {
  Home,
  BookOpen,
  Building,
  Building2,
  User,
  GraduationCap,
  CalendarRange,
  Users,
  CalendarDays,
  PieChart,
  DoorOpen,
  LogOut,
  Calendar,
  Merge,
} from "lucide-react";
import image from "../assets/images/betterLogo.jpeg";

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const baseItems = [
      {
        label: "Accueil",
        to: "/dashboard",
        icon: <Home size={18} />,
        roles: [
          "Formateur",
          "DirecteurSuper",
          "DirecteurRegional",
          "DirecteurComplexe",
          "DirecteurEtablissement",
        ],
      },
      {
        label: "Secteurs - Efp",
        to: "/secteurs-etablissements",
        icon: <PieChart size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Filières - Efp",
        to: "/offres-formations",
        icon: <GraduationCap size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Affectations",
        to: "/affectations",
        icon: <Merge size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Calendrier",
        to: "/calendar",
        icon: <CalendarDays size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Année Scolaires",
        to: "/annees-scolaires",
        icon: <BookOpen size={18} />,
        roles: ["DirecteurSuper"],
      },
      {
        label: "Utilisateurs",
        to: "/utilisateurs",
        icon: <User size={18} />,
        roles: ["DirecteurSuper", "DirecteurRegional", "DirecteurEtablissement"],
      },
      {
        label: "Directions Régionales",
        to: "/directions-regionales",
        icon: <Building2 size={18} />,
        roles: ["DirecteurSuper"],
      },
      {
        label: "Complexes",
        to: "/complexes",
        icon: <Building size={18} />,
        roles: ["DirecteurRegional"],
      },
      {
        label: "Secteurs",
        to: "/secteurs",
        icon: <PieChart size={18} />,
        roles: ["DirecteurSuper"],
      },
      {
        label: "Filières",
        to: "/filieres",
        icon: <GraduationCap size={18} />,
        roles: ["DirecteurSuper"],
      },
      {
        label: "Jours fériés",
        to: "/feries",
        icon: <CalendarRange size={18} />,
        roles: ["DirecteurSuper"],
      },
      {
        label: "Établissements",
        to: "/etablissements",
        icon: <Building size={18} />,
        roles: ["DirecteurRegional"],
      },
      {
        label: "Formateurs",
        to: "/formateurs",
        icon: <GraduationCap size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Semaines",
        to: "/semaines",
        icon: <CalendarDays size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Groupes",
        to: "/groupes",
        icon: <Users size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Salles",
        to: "/salles",
        icon: <DoorOpen size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Modules",
        to: "/modules",
        icon: <BookOpen size={18} />,
        roles: ["DirecteurEtablissement"],
      },
      {
        label: "Mes séances",
        to: "/mes-seances",
        icon: <Calendar size={18} />,
        roles: ["Formateur"],
      },
    ];

    // Ajouter les accès du formateur s'il peut gérer les séances
    if (user?.role === "Formateur" && user?.formateur?.peut_gerer_seance) {
      baseItems.push(
        {
          label: "Calendrier",
          to: "/calendar",
          icon: <CalendarDays size={18} />,
          roles: ["Formateur"],
        },
        {
          label: "Semaines",
          to: "/semaines",
          icon: <CalendarDays size={18} />,
          roles: ["Formateur"],
        }
      );
    }

    setMenuItems(baseItems);
  }, [user]);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const userRole = user?.role;

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div
      className={`${
        open ? "w-60" : "w-16"
      } fixed left-0 top-0 h-full bg-gray-800 text-white p-4 z-50 transition-all duration-300 overflow-y-auto flex flex-col`}
    >
      <div className="flex items-center mb-6">
        <img
          src={image}
          alt="Menu"
          className="cursor-pointer h-8 w-8 object-contain rounded-full"
          onClick={() => setOpen(!open)}
        />
        {open && <span className="text-xl ms-2 font-bold">OFPPT</span>}
      </div>

      <ul className="space-y-4 flex-1">
        {filteredMenuItems.map((item) => (
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

      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded cursor-pointer ${
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
