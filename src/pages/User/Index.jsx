import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexUser = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get("/utilisateurs"); // Correct endpoint
        setUsers(response.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des utilisateurs.",
        });
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/utilisateurs/${item.id}`); // Send DELETE request
      setUsers((prev) => prev.filter((u) => u.id !== item.id)); // Remove deleted user
      setMessage({ type: "success", text: "Utilisateur supprimé avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/utilisateurs/edit/${item.id}`);
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
          onClick={() => navigate("/utilisateurs/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un utilisateur
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
