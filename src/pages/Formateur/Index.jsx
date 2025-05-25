import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexFormateur = () => {
  const [formateurs, setFormateurs] = useState([
    {
      id: 1,
      utilisateur_id: 1,
      etablissement_id: 1,
      specialite: "Mathématiques",
      heures_hebdomadaire: 18,
    },
    {
      id: 2,
      utilisateur_id: 2,
      etablissement_id: 1,
      specialite: "Physique",
      heures_hebdomadaire: 20,
    },
  ]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = (item) => {
    setFormateurs((prev) => prev.filter((f) => f.id !== item.id));
    setMessage({ type: "success", text: "Formateur supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/formateurs/edit/${item.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "utilisateur_id", label: "Utilisateur" },
    { key: "etablissement_id", label: "Établissement" },
    { key: "specialite", label: "Spécialité" },
    { key: "heures_hebdomadaire", label: "Heures Hebdo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des formateurs</h1>
        <button
          onClick={() => navigate("/formateurs/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer un formateur
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={formateurs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexFormateur;
