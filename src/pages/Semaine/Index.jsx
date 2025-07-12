import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import HideMessage from "../../components/ui/hideMessage";

const IndexSemaine = () => {
  const [semaines, setSemaines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemaines = async () => {
      try {
        const res = await API.get("/semaines");
        const rawSemaines = res.data.data;

        // Transformer pour afficher nom d'année scolaire
        const transformed = rawSemaines.map((semaine) => ({
          ...semaine,
          annee_info: semaine.annee_scolaire?.nom || "Non défini",
        }));
        setLoading(false);
        setSemaines(transformed);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des semaines.",
        });
      }
    };

    fetchSemaines();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/semaines/${item.id}`); // Send DELETE request
      setSemaines((prev) => prev.filter((s) => s.id !== item.id)); // Remove deleted semaine
      setMessage({ type: "success", text: "Semaine supprimée." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/semaines/edit/${item.id}`);
  };

  const columns = [
    { key: "numero_semaine", label: "Numéro" },
    { key: "date_debut", label: "Date Début" },
    { key: "date_fin", label: "Date Fin" },
    { key: "annee_info", label: "Année Scolaire" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des semaines</h1>
        <button
          onClick={() => navigate("/semaines/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Créer une semaine
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <HideMessage message={message} onHide={() => setMessage(null)} />
      <Table
        columns={columns}
        data={semaines}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexSemaine;
