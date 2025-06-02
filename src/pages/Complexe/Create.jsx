import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateComplexe = () => {
  const [nom, setNom] = useState("");
  const [directionRegionalId, setDirectionRegionalId] = useState("");
  const [directeurComplexeId, setDirecteurComplexeId] = useState("");
  const [directions, setDirections] = useState([]);
  const [directeursComplexes, setDirecteursComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await API.get("/complexes");
        setDirections(
          res.data.direction_regionales.map((d) => ({
            value: d.id,
            label: d.nom,
          }))
        );
        setDirecteursComplexes(
          res.data.directeur_complexes.map((dc) => ({
            value: dc.id,
            label: dc.utilisateur.nom,
          }))
        );
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des options.",
        });
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/complexes", {
        nom,
        direction_regional_id: directionRegionalId,
        directeur_complexe_id: directeurComplexeId,
      });
      setMessage({ type: "success", text: "Complexe créé avec succès." });
      setTimeout(() => navigate("/complexes"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du complexe"
        />

        <Label htmlFor="direction_regional_id">Direction Régionale</Label>
        <Select
          name="direction_regional_id"
          options={directions}
          value={directionRegionalId}
          onChange={(e) => setDirectionRegionalId(e.target.value)}
        />

        <Label htmlFor="directeur_complexe_id">Directeur Complexe</Label>
        <Select
          name="directeur_complexe_id"
          options={directeursComplexes}
          value={directeurComplexeId}
          onChange={(e) => setDirecteurComplexeId(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Création en cours..." : "Créer"}
        </Button>
      </Form>
    </>
  );
};

export default CreateComplexe;
