import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditOffrir = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filiereId, setFiliereId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [filieres, setFilieres] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer l'offre à modifier
        const offreRes = await API.get(`/offres-formations/${id}`);
        const offre = offreRes.data.data;

        // Récupérer la liste des filières et établissements disponibles
        const dataRes = await API.get("/offres-formations");

        setFiliereId(offre.filiere_id);
        setEtablissementId(offre.etablissement_id);
        setFilieres(dataRes.data.filieres);
        setEtablissements(dataRes.data.etablissement);
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
      await API.put(`/offres-formations/${id}`, {
        filiere_id: filiereId,
        etablissement_id: etablissementId,
      });

      setMessage({
        type: "success",
        text: "Offre de formation modifiée avec succès.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {message && (
        <Message
          type={message.type}
          text={message.text}
          onConfirm={
            message.type === "success" ? () => navigate(-1) : undefined
          }
        />
      )}
      <Form onSubmit={handleSubmit} title="Modifier l'offre de formation">
        <Label htmlFor="filiereId">Filière</Label>
        <Select
          name="filiere_id"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          options={filieres.map((f) => ({
            value: f.id,
            label: f.nom,
          }))}
          required
        />

        <Label htmlFor="etablissementId">Établissement</Label>
        <Select
          name="etablissement_id"
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements.map((e) => ({
            value: e.id,
            label: e.nom,
          }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditOffrir;
