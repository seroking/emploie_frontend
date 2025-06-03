import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const IndexFormateur = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        const response = await API.get("/formateurs");
        const rawFormateurs = response.data.data;

        // Transformer les données pour aplatir les objets imbriqués
        const transformed = rawFormateurs.map((formateur) => ({
          ...formateur,
          utilisateur_nom: formateur.utilisateur?.nom || "Non défini",
          etablissement_nom: formateur.etablissement?.nom || "Non défini",
          complexe_nom: formateur.complexe?.nom || "Non défini",
          direction_regional_nom: formateur.direction_regional?.nom || "Non défini",
        }));

        setFormateurs(transformed);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des formateurs.",
        });
      }
    };

    fetchFormateurs();
  }, []);

  const handleDelete = async (item) => {
    if (user?.role === "DirecteurEtablissement") return;
    try {
      await API.delete(`/formateurs/${item.id}`);
      setFormateurs((prev) => prev.filter((f) => f.id !== item.id));
      setMessage({ type: "success", text: "Formateur supprimé avec succès." });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression du formateur.",
      });
    }
  };

  const handleEdit = (item) => {
    navigate(`/formateurs/edit/${item.id}`);
  };

  const columns = [
    { key: "utilisateur_nom", label: "Utilisateur" },
    { key: "etablissement_nom", label: "Établissement" },
    { key: "complexe_nom", label: "Complexe" },
    { key: "direction_regional_nom", label: "Direction Régionale" },
    { key: "specialite", label: "Spécialité" },
    { key: "heures_hebdomadaire", label: "Heures Hebdo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des formateurs</h1>
        {user?.role !== "DirecteurEtablissement" && (
          <button
            onClick={() => navigate("/formateurs/create")}
            className="justify-end w-auto px-4 py-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
          >
            + Créer un formateur
          </button>
        )}

      </div>
      {message && <Message type={message.type} text={message.text} />}
      <Table
        columns={columns}
        data={formateurs}
        onEdit={handleEdit}
        onDelete={user?.role !== "DirecteurEtablissement" ? handleDelete : () => {}}
      />
    </div>
  );
};

export default IndexFormateur;
