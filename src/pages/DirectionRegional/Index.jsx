import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import HideMessage from "../../components/ui/hideMessage";

const IndexDirectionRegional = () => {
  const [directions, setDirections] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const response = await API.get("/directions-regionales");
        const directionsData = response.data.data;

        const enriched = directionsData.map((direction) => ({
          ...direction,
          directeur_nom:
            direction.directeur_regional?.utilisateur?.nom || "Non défini",
        }));
        setLoading(false);
        setDirections(enriched);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des directions régionales.",
        });
      }
    };

    fetchDirections();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/directions-regionales/${item.id}`);
      setDirections((prev) => prev.filter((d) => d.id !== item.id));
      setMessage({
        type: "success",
        text: "Direction régionale supprimée avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/directions-regionales/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "adresse", label: "Adresse" },
    { key: "telephone", label: "Téléphone" },
    { key: "directeur_nom", label: "Directeur Régional" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des directions régionales</h1>
        <button
          onClick={() => navigate("/directions-regionales/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une direction
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <HideMessage message={message} onHide={() => setMessage(null)} />
      <Table
        columns={columns}
        data={directions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexDirectionRegional;
