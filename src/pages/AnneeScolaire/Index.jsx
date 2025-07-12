import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import HideMessage from "../../components/ui/hideMessage";
import Loading from "../../components/ui/Loading";

const IndexAnneeScolaire = () => {
  const [annees, setAnnees] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/annees-scolaires")
      .then((res) => setAnnees(res.data.data))
      .catch(() => setMessage({ type: "error", text: "Erreur de chargement." }))
      .finally(setLoading(false));
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/annees-scolaires/${item.id}`);
      setAnnees((prev) => prev.filter((a) => a.id !== item.id));
      setMessage({ type: "success", text: "Année scolaire supprimée." });
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la suppression." });
    }
  };

  const handleEdit = (item) => {
    navigate(`/annees-scolaires/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "date_debut", label: "Date Début" },
    { key: "date_fin", label: "Date Fin" },
  ];
  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des années scolaires</h1>
        <button
          onClick={() => navigate("/annees-scolaires/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une année scolaire
        </button>
      </div>

      {message && <Message type={message.type} text={message.text} />}
      <HideMessage message={message} onHide={() => setMessage(null)} />

      <Table
        columns={columns}
        data={annees}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexAnneeScolaire;
