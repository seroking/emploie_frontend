import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import HideMessage from "../../components/ui/hideMessage";
import Loading from "../../components/ui/Loading";

const IndexComplexe = () => {
  const [complexes, setComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        const response = await API.get("/complexes"); // Fetch complexes
        const rawComplexes = response.data.data;

        // Transformer les données pour afficher le nom de la direction régionale
        const transformed = rawComplexes.map((complexe) => ({
          ...complexe,
          direction_info: complexe.direction_regional?.nom || "Non défini",
        }));

        setComplexes(transformed);
        setLoading(false);
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
      await API.delete(`/complexes/${item.id}`);
      setComplexes((prev) => prev.filter((c) => c.id !== item.id));
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
    { key: "direction_info", label: "Direction Régionale" },
  ];

  if (loading) return <Loading />;

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
      <HideMessage message={message} onHide={() => setMessage(null)} />
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
