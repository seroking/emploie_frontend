import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexDirectionRegional = () => {
  const [directions, setDirections] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/directions-regionales")
      .then((res) => setDirections(res.data.data))
      .catch(() =>
        setMessage({ type: "error", text: "Erreur de chargement des directions." })
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
      await API.delete(`/directions-regionales/${item.id}`);
      setDirections((prev) => prev.filter((d) => d.id !== item.id));
      setMessage({ type: "success", text: "Direction régionale supprimée." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/directions-regionales/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "adresse", label: "Adresse" },
    { key: "telephone", label: "Téléphone" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des directions régionales</h1>
        <button
          onClick={() => navigate("/directions-regionales/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une direction
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={directions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexDirectionRegional;
