import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import HideMessage from "../../components/ui/hideMessage";

const IndexFerie = () => {
  const [feries, setFeries] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeries = async () => {
      try {
        const response = await API.get("/feries"); // Fetch feries
        setFeries(response.data.data);
        setLoading(false);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des jours fériés.",
        });
      }
    };

    fetchFeries();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/feries/${item.id}`); // Send DELETE request
      setFeries((prev) => prev.filter((f) => f.id !== item.id)); // Remove deleted ferie
      setMessage({ type: "success", text: "Jour férié supprimé avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/feries/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "date_debut", label: "Début" },
    { key: "date_fin", label: "Fin" },
  ];
  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des jours fériés</h1>
        <button
          onClick={() => navigate("/feries/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un jour férié
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <HideMessage message={message} onHide={() => setMessage(null)} />
      <Table
        columns={columns}
        data={feries}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexFerie;
