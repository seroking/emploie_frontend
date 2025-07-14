import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
      Bienvenue {user.nom}
    </h2>
  );
}
