import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexFiliere = () => {
  const [filieres, setFilieres] = useState([
    { id: 1, nom: "Informatique" },
    { id: 2, nom: "Gestion" },
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
    setFilieres((prev) => prev.filter((f) => f.id !== item.id));
    setMessage({ type: "success", text: "Filière supprimée avec succès." });
  };

  const handleEdit = (item) => {
    navigate(`/filieres/edit/${item.id}`);
  };

  const columns = [{ key: "nom", label: "Nom" }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des filières</h1>
        <button
          onClick={() => navigate("/filieres/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une filière
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={filieres}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexFiliere;
