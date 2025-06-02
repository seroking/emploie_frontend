import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexFormateur = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        const response = await API.get("/formateurs");
        setFormateurs(response.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des formateurs.",
        });
      }
    };

    fetchFormateurs();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/formateurs/${item.id}`);
      setFormateurs((prev) => prev.filter((f) => f.id !== item.id));
      setMessage({ type: "success", text: "Formateur supprimé avec succès." });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression du formateur.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/formateurs/edit/${item.id}`);
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "utilisateur.nom", label: "Utilisateur" },
    { key: "etablissement.nom", label: "Établissement" },
    { key: "specialite", label: "Spécialité" },
    { key: "heures_hebdomadaire", label: "Heures Hebdo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des formateurs</h1>
        <button
          onClick={() => navigate("/formateurs/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer un formateur
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={formateurs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexFormateur;
