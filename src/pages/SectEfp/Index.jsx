import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const IndexSectEfp = () => {
  const [sectEfp, setSectEfp] = useState([]);
  const [etablissementId, setEtablissementId] = useState();
  const [secteurId, setSecteurId] = useState();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await API.get("/secteurs-etablissements");
        const rawEtablissements = response.data.data;
        const transformed = rawEtablissements.map((sectEfp) => ({
          ...sectEfp,
          etablissement_info: sectEfp.etablissement?.nom || "Non défini",
          secteur_info: sectEfp.secteur?.nom || "Non défini",
        }));
        setSectEfp(transformed);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des établissements.",
        });
      }
    };

    fetchEtablissements();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/secteurs-etablissements/${item.id}`);
      setSectEfp((prev) => prev.filter((c) => c.id !== item.id));
      setMessage({
        type: "success",
        text: "secteur/efp supprimé avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/secteurs-etablissements/edit/${item.id}`);
  };

  const columns = [
    { key: "etablissement_info", label: "Etablissement" },
    { key: "secteur_info", label: "Secteur" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des secteurs de l'établissement</h1>
        <button
          onClick={() => navigate("/secteurs-etablissements/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un secteur/efp
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={sectEfp}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};
export default IndexSectEfp;
