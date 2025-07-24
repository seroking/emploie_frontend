import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import MessageAlert from "../../components/ui/MessageAlert";

const IndexModule = () => {
  const [modules, setModules] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await API.get("/modules");
        const rawModules = response.data.data;

        // Transformer pour ajouter le nom de la filière
        const transformed = rawModules.map((module) => ({
          ...module,
          filiere_nom: module.filiere?.nom || "Non défini",
          masse_horaire_total:
            module.masse_horaire_presentiel + module.masse_horaire_distanciel,
        }));

        setModules(transformed);
        setLoading(false);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des modules.",
        });
      }
    };

    fetchModules();
  }, []);

  const handleDelete = async (item) => {
    const confirmed = await MessageAlert(`le module "${item.nom}"`);
    if (!confirmed) return;
    try {
      await API.delete(`/modules/${item.id}`); // Send DELETE request
      setModules((prev) => prev.filter((m) => m.id !== item.id)); // Remove deleted module
      setMessage({ type: "success", text: "Module supprimé avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la suppression.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/modules/edit/${item.id}`);
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "masse_horaire_total", label: "Masse horaire total" },
    { key: "masse_horaire_presentiel", label: "MH présentiel" },
    { key: "masse_horaire_distanciel", label: "MH distanciel" },
    { key: "type_efm", label: "Type EFM" },
    { key: "semestre", label: "Semestre" },
    { key: "filiere_nom", label: "Filière" },
  ];

  if (loading) return <Loading />;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des modules</h1>
        <button
          onClick={() => navigate("/modules/create")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
          + Ajouter un module
        </button>
      </div>
      {message && <Message type={message.type} text={message.text} />}
      
      <Table
        columns={columns}
        data={modules}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexModule;
