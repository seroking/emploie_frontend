import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexSemaine = () => {
  const [semaines, setSemaines] = useState([
    {
      id: 1,
      numero_semaine: 1,
      date_debut: "2024-09-02",
      date_fin: "2024-09-08",
      annee_scolaire_id: 1,
      annee_scolaire_nom: "2024-2025",
    },
    {
      id: 2,
      numero_semaine: 2,
      date_debut: "2024-09-09",
      date_fin: "2024-09-15",
      annee_scolaire_id: 1,
      annee_scolaire_nom: "2024-2025",
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
    setSemaines((prev) => prev.filter((s) => s.id !== item.id));
    setMessage({ type: "success", text: "Semaine supprimée." });
  };

  const handleEdit = (item) => {
    navigate(`/semaines/edit/${item.id}`);
  };

  const columns = [
    { key: "numero_semaine", label: "Numéro" },
    { key: "date_debut", label: "Date début" },
    { key: "date_fin", label: "Date fin" },
    { key: "annee_scolaire_nom", label: "Année scolaire" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des semaines</h1>
        <button
          onClick={() => navigate("/semaines/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter une semaine
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={semaines}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexSemaine;
