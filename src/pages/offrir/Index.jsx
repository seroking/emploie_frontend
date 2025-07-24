import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import MessageAlert from "../../components/ui/MessageAlert";

const IndexOffrir = () => {
  const [offres, setOffres] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [etablissement, setEtablissement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await API.get("/offres-formations");
        const rawOffres = response.data.data;
        const transformed = rawOffres.map((offre) => ({
          ...offre,
          etablissement_info: offre.etablissement?.nom || "Non défini",
          filiere_info: offre.filiere?.nom || "Non défini",
        }));
        setOffres(transformed);
        setFilieres(response.data.filieres);
        setEtablissement(response.data.etablissement);
        setLoading(false);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des offres de formation.",
        });
      }
    };

    fetchOffres();
  }, []);

  const handleDelete = async (item) => {
    const confirmed = await MessageAlert(`la filiere "${item.filiere_info}"`);
    if (!confirmed) return;
    try {
      await API.delete(`/offres-formations/${item.id}`);
      setOffres((prev) => prev.filter((o) => o.id !== item.id));
      setMessage({
        type: "success",
        text: "Offre de formation supprimée avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/offres-formations/edit/${item.id}`);
  };

  const columns = [
    { key: "etablissement_info", label: "Établissement" },
    { key: "filiere_info", label: "Filière" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des filieres offrés par l'établissement</h1>
        <button
          onClick={() => navigate("/offres-formations/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter une filiere
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      
      <Table
        columns={columns}
        data={offres}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexOffrir;
