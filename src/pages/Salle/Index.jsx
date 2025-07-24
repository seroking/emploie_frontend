import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import MessageAlert from "../../components/ui/MessageAlert";

const IndexSalle = () => {
  const [salles, setSalles] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const response = await API.get("/salles");
        const rawSalles = response.data.salles;

        // On transforme les données pour extraire le nom de l'établissement
        const transformed = rawSalles.map((salle) => ({
          ...salle,
          etablissement_nom: salle.etablissement?.nom || "Non défini",
        }));
        setLoading(false);
        setSalles(transformed);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des salles.",
        });
      }
    };

    fetchSalles();
  }, []);

  const handleDelete = async (item) => {
    const confirmed = await MessageAlert(`la salle "${item.nom}"`);
    if (!confirmed) return;
    try {
      await API.delete(`/salles/${item.id}`); // Send DELETE request
      setSalles((prev) => prev.filter((s) => s.id !== item.id)); // Remove deleted salle
      setMessage({ type: "success", text: "Salle supprimée avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/salles/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "capacite", label: "Capacité" },
    { key: "type", label: "Type" },
    { key: "etablissement_nom", label: "Établissement" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des salles</h1>
        <button
          onClick={() => navigate("/salles/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter une salle
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={salles}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexSalle;
