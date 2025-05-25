import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexFerie = () => {
  const [feries, setFeries] = useState([
    { id: 1, nom: "Noël", date_debut: "2025-12-24", date_fin: "2025-12-26" },
    {
      id: 2,
      nom: "Nouvel An",
      date_debut: "2026-01-01",
      date_fin: "2026-01-01",
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
    setFeries((prev) => prev.filter((f) => f.id !== item.id));
    setMessage({ type: "success", text: "Jour férié supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/feries/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "date_debut", label: "Début" },
    { key: "date_fin", label: "Fin" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des jours fériés</h1>
        <button
          onClick={() => navigate("/feries/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un jour férié
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={feries}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexFerie;
