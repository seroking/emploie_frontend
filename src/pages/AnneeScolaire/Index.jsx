import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexAnneeScolaire = () => {
  const [annees, setAnnees] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/annees-scolaires")
      .then((res) => setAnnees(res.data.data))
      .catch(() =>
        setMessage({ type: "error", text: "Erreur de chargement." })
      );
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/annees-scolaires/${item.id}`);
      setAnnees((prev) => prev.filter((a) => a.id !== item.id));
      setMessage({ type: "success", text: "Année scolaire supprimée." });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
    }
  };

  // Nouvelle fonction : navigation vers la page d'édition
  const handleEdit = (item) => {
    navigate(`/annees-scolaires/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "date_debut", label: "Date Début" },
    { key: "date_fin", label: "Date Fin" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des années scolaires</h1>
        <button
          onClick={() => navigate("/annees-scolaires/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une année scolaire
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={annees}
        onEdit={handleEdit} // ici on appelle navigate
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexAnneeScolaire;
