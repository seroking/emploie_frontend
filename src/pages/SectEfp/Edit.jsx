import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditSectEfp = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [secteurId, setSecteurId] = useState("");
  const [secteurs, setSecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'association secteur/établissement à modifier
        const sectEfpRes = await API.get(`/secteurs-etablissements/${id}`);
        const sectEfp = sectEfpRes.data.data;

        // Récupérer la liste des secteurs et établissements disponibles
        const secteursEtabRes = await API.get("/secteurs-etablissements");

        setSecteurId(sectEfp.secteur_id);
        setSecteurs(secteursEtabRes.data.secteurs);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/secteurs-etablissements/${id}`, {
        secteur_id: secteurId,
      });

      setMessage({
        type: "success",
        text: "Association secteur/établissement modifiée avec succès.",
      });
      setTimeout(() => navigate("/secteurs-etablissements"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form
        onSubmit={handleSubmit}
        title="Modifier l'association Secteur-Etablissement"
      >
        <Label htmlFor="secteurId">Secteur</Label>
        <Select
          name="secteur_id"
          value={secteurId}
          onChange={(e) => setSecteurId(e.target.value)}
          options={secteurs.map((s) => ({
            value: s.id,
            label: s.nom,
          }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditSectEfp;
