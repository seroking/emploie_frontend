import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexSecteur = () => {
  const [secteurs, setSecteurs] = useState([
    { id: 1, nom: "Santé" },
    { id: 2, nom: "Industrie" },
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
    setSecteurs((prev) => prev.filter((s) => s.id !== item.id));
    setMessage({ type: "success", text: "Secteur supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/secteurs/edit/${item.id}`);
  };

  const columns = [{ key: "nom", label: "Nom" }];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des secteurs</h1>
        <button
          onClick={() => navigate("/secteurs/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un secteur
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={secteurs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexSecteur;
