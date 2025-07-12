import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import HideMessage from "../../components/ui/hideMessage";

const IndexFiliere = () => {
  const [filieres, setFilieres] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFilieres = async () => {
      try {
        const response = await API.get("/filieres"); // Fetch filieres
        const rawFilieres = response.data.data;

        // Transformer les données pour affichage
        const transformed = rawFilieres.map((filiere) => ({
          ...filiere,
          secteur_info: `${filiere.secteur?.nom}`,
        }));
        setLoading(false);
        setFilieres(transformed);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des filières.",
        });
      }
    };

    fetchFilieres();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/filieres/${item.id}`); // Send DELETE request
      setFilieres((prev) => prev.filter((f) => f.id !== item.id)); // Remove deleted filiere
      setMessage({ type: "success", text: "Filière supprimée avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/filieres/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "secteur_info", label: "Secteur" },
  ];
if (loading) return <Loading/>;
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
      <HideMessage message={message} onHide={() => setMessage(null)} />
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
