import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";


const IndexEtablissement = () => {
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await API.get("/etablissements");
        const data = response.data;

        const transformed = data.etablissements.map((etab) => ({
          ...etab,
          complexe_nom: etab.complexe?.nom ?? "Non défini",
          directeur_nom:
            etab.directeur_etablissement?.utilisateur?.nom || "Non défini",
        }));

        setEtablissements(transformed);
        setLoading(false);
      } catch (error) {
        setMessage({ type: "error", text: "Erreur de chargement." });
      }
    };

    fetchEtablissements();
  }, []);

  const handleEdit = (item) => {
    navigate(`/etablissements/edit/${item.id}`);
  };

  const handleDelete = async (item) => {
    // if (!window.confirm("Voulez-vous vraiment supprimer cet établissement ?"))
    //   return;
    try {
      await API.delete(`/etablissements/${item.id}`);
      setEtablissements((prev) => prev.filter((e) => e.id !== item.id));
      setMessage({
        type: "success",
        text: "Établissement supprimé avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Erreur lors de la suppression de l'établissement.",
      });
    }
  };

  const columns = [
    { key: "nom", label: "Nom" },
    { key: "adresse", label: "Adresse" },
    { key: "telephone", label: "Téléphone" },
    { key: "complexe_nom", label: "Complexe" },
    { key: "directeur_nom", label: "Directeur" },
  ];

  if (loading) return <Loading />;

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
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default IndexEtablissement;
