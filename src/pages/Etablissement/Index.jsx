import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexEtablissement = () => {
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await API.get("/etablissements");
        setEtablissements(response.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des établissements",
        });
      }
    };
    fetchEtablissements();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/etablissements/${item.id}`);
      setEtablissements((prev) => prev.filter((e) => e.id !== item.id));
      setMessage({ type: "success", text: "Établissement supprimé." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression",
      });
    }
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "adresse", label: "Adresse" },
    { key: "telephone", label: "Téléphone" },
    {
      key: "directeur_etablissement",
      label: "Directeur",
      render: (item) => item.directeur_etablissement?.nom || "N/A",
    },
    {
      key: "complexe",
      label: "Complexe",
      render: (item) => item.complexe?.nom || "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des établissements</h1>
        <button
          onClick={() => navigate("/etablissements/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un établissement
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={etablissements}
        onEdit={(item) => navigate(`/etablissements/edit/${item.id}`)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexEtablissement;
