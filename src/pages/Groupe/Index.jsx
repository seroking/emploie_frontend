import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexGroupe = () => {
  const [groupes, setGroupes] = useState([
    {
      id: 1,
      nom: "Groupe 1",
      annee: "2023-2024",
      filiere_id: 1,
      filiere_nom: "Informatique",
      etablissement_id: 1,
      etablissement_nom: "Lycée Jean Moulin",
    },
    {
      id: 2,
      nom: "Groupe 2",
      annee: "2023-2024",
      filiere_id: 2,
      filiere_nom: "Commerce",
      etablissement_id: 2,
      etablissement_nom: "Collège Victor Hugo",
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
    setGroupes((prev) => prev.filter((g) => g.id !== item.id));
    setMessage({ type: "success", text: "Groupe supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/groupes/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "annee", label: "Année" },
    { key: "filiere_nom", label: "Filière" },
    { key: "etablissement_nom", label: "Établissement" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des groupes</h1>
        <button
          onClick={() => navigate("/groupes/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un groupe
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={groupes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexGroupe;
