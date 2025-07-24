import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import MessageAlert from "../../components/ui/MessageAlert";

const IndexGroupe = () => {
  const [groupes, setGroupes] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch groupes from the backend
  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const res = await API.get("/groupes");
        const rawGroupes = res.data.data;

        const transformed = rawGroupes.map((groupe) => ({
          ...groupe,
          filiere_info: groupe.filiere?.nom || "Non défini",
          etablissement_info: groupe.etablissement?.nom || "Non défini",
        }));

        setGroupes(transformed);
        setLoading(false);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des groupes.",
        });
      }
    };

    fetchGroupes();
  }, []);

  // Handle delete operation
  const handleDelete = async (item) => {
    const confirmed = await MessageAlert(`le groupe "${item.nom}"`);
    if (!confirmed) return;
    try {
      await API.delete(`/groupes/${item.id}`); // Backend delete endpoint
      setGroupes((prev) => prev.filter((g) => g.id !== item.id)); // Remove deleted item
      setMessage({ type: "success", text: "Groupe supprimé." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  // Handle edit operation
  const handleEdit = (item) => {
    navigate(`/groupes/edit/${item.id}`); // Navigate to edit page
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "annee", label: "Année" },
    { key: "filiere_info", label: "Filière" },
    { key: "etablissement_info", label: "Établissement" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des groupes</h1>
        <button
          onClick={() => navigate("/groupes/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un groupe
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      
      <Table
        columns={columns}
        data={groupes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexGroupe;
