import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import Loading from "../../components/ui/Loading";
import MessageAlert from "../../components/ui/MessageAlert";

import API from "../../services/api";

const IndexAffectation = () => {
  const [affectations, setAffectations] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAffectations = async () => {
      try {
        const res = await API.get("/affectations");
        const rawAffectations = res.data.data;

        const transformed = rawAffectations.map((item) => ({
          ...item,
          formateur_info: item.formateur?.utilisateur?.nom || "Non défini",
          module_info: item.module?.nom || "Non défini",
          groupe_info: item.groupe?.nom || "Non défini",
        }));

        setAffectations(transformed);
        setLoading(false);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des affectations.",
        });
        setLoading(false);
      }
    };

    fetchAffectations();
  }, []);

  const handleDelete = async (item) => {
    const confirmed = await MessageAlert(`cette affectation`);
    if (!confirmed) return;
    try {
      await API.delete(`/affectations/${item.id}`);
      setAffectations((prev) => prev.filter((a) => a.id !== item.id));
      setMessage({ type: "success", text: "Affectation supprimée." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/affectations/edit/${item.id}`);
  };

  const columns = [
    { key: "module_info", label: "Module" },
    { key: "formateur_info", label: "Enseigné par" },
    { key: "groupe_info", label: "Affecté au groupe" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des affectations</h1>
        <button
          onClick={() => navigate("/affectations/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter une affectation
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      
      <Table
        columns={columns}
        data={affectations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexAffectation;
