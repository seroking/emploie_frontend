import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexComplexe = () => {
  const [complexes, setComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        const response = await API.get("/complexes"); // Fetch complexes
        setComplexes(response.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des complexes.",
        });
      }
    };

    fetchComplexes();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/complexes/${item.id}`); // Send DELETE request
      setComplexes((prev) => prev.filter((c) => c.id !== item.id)); // Remove deleted complexe
      setMessage({ type: "success", text: "Complexe supprimé avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/complexes/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "direction_regional.nom", label: "Direction Régionale" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des complexes</h1>
        <button
          onClick={() => navigate("/complexes/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un complexe
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={complexes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexComplexe;
