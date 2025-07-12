import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditSalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [type, setType] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salleRes = await API.get(`/salles/${id}`); // Fetch specific salle
        const response = await API.get("/salles"); // Fetch etablissements
        setEtablissements([response.data.etablissement]); // Fetch etablissements

        const salle = salleRes.data.data;
        setNom(salle.nom);
        setCapacite(salle.capacite);
        setType(salle.type);
        setEtablissementId(salle.etablissement_id);
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
      await API.put(`/salles/${id}`, {
        nom,
        capacite,
        type,
        etablissement_id: etablissementId,
      });
      setMessage({ type: "success", text: "Salle modifiée avec succès." });
      setTimeout(() => navigate("/salles"), 1500);
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
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Modifier une Salle">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="capacite">Capacité</Label>
        <Input
          name="capacite"
          type="number"
          value={capacite}
          onChange={(e) => setCapacite(e.target.value)}
          required
        />

        <Label htmlFor="type">Type</Label>
        <Select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: "Salle", label: "Salle" },
            { value: "Atelier", label: "Atelier" },
          ]}
          required
        />

        <Label htmlFor="etablissementId">Établissement</Label>
        <Select
          name="etablissementId"
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

export default EditSalle;
