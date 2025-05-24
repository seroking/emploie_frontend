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
    API.get("/complexes")
      .then((res) => setComplexes(res.data.data))
      .catch(() =>
        setMessage({ type: "error", text: "Erreur de chargement des complexes." })
      );
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/complexes/${item.id}`);
      setComplexes((prev) => prev.filter((c) => c.id !== item.id)); // <-- IMPORTANT
      setMessage({ type: "success", text: "Complexe supprimé." });
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
    { key: "direction_regional_id", label: "Direction Régionale" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des complexes</h1>
        <button
          onClick={() => navigate("/complexes/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer un complexe
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
