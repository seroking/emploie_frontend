import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
      return "Bonsoir";
    }
    return "Bonjour";
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        {getGreeting()} {formatName(user?.nom || "")}
      </h2>
    </div>
  );
}
