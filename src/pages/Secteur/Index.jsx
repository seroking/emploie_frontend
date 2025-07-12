import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import HideMessage from "../../components/ui/hideMessage";

const IndexSecteur = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const res = await API.get("/secteurs"); // Fetch secteurs from backend
        setSecteurs(res.data.data);
        setLoading(false);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des secteurs.",
        });
      }
    };

    fetchSecteurs();
  }, []);

  const handleDelete = async (item) => {
    try {
      await API.delete(`/secteurs/${item.id}`); // Send DELETE request
      setSecteurs((prev) => prev.filter((s) => s.id !== item.id)); // Remove deleted secteur
      setMessage({ type: "success", text: "Secteur supprimé." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/secteurs/edit/${item.id}`); // Navigate to edit page
  };

  const columns = [{ key: "nom", label: "Nom" }];
  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des secteurs</h1>
        <button
          onClick={() => navigate("/secteurs/create")}
          className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un secteur
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      <HideMessage message={message} onHide={() => setMessage(null)} />
      <Table
        columns={columns}
        data={secteurs}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexSecteur;
