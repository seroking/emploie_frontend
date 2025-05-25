import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexUser = () => {
  const [users, setUsers] = useState([
    { id: 1, nom: "Jean Dupont", email: "jean@example.com", role: "Formateur" },
    {
      id: 2,
      nom: "Marie Curie",
      email: "marie@example.com",
      role: "Directeur",
    },
  ]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const navigate = useNavigate();

  const handleDelete = (item) => {
    setUsers((prev) => prev.filter((u) => u.id !== item.id));
    setMessage({ type: "success", text: "Utilisateur supprimé." });
  };

  const handleEdit = (item) => {
    navigate(`/users/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des utilisateurs</h1>
        <button
          onClick={() => navigate("/users/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer un utilisateur
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexUser;
