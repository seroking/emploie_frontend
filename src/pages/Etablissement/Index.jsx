import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexEtablissement = () => {
  const [etablissements, setEtablissements] = useState([
    {
      id: 1,
      nom: "Lycée Jean Moulin",
      adresse: "123 Rue Principale",
      telephone: "0123456789",
      directeur_id: 1,
      directeur_nom: "Jean Dupont",
    },
    {
      id: 2,
      nom: "Collège Victor Hugo",
      adresse: "456 Rue Secondaire",
      telephone: "0987654321",
      directeur_id: 2,
      directeur_nom: "Marie Curie",
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
    setEtablissements((prev) => prev.filter((e) => e.id !== item.id));
    setMessage({ type: "success", text: "Établissement supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/etablissements/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "adresse", label: "Adresse" },
    { key: "telephone", label: "Téléphone" },
    { key: "directeur_nom", label: "Directeur" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des établissements</h1>
        <button
          onClick={() => navigate("/etablissements/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un établissement
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={etablissements}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexEtablissement;
