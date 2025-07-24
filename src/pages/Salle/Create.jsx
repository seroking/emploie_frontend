import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import BackButton from "../../components/ui/BackButton";

const CreateSalle = () => {
  const [nom, setNom] = useState("");
  const [capacite, setCapacite] = useState("");
  const [type, setType] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await API.get("/salles"); // Fetch etablissements
        setEtablissements([response.data.etablissement]);
        setEtablissementId(response.data.etablissement.id);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des établissements.",
        });
      }
    };

    fetchEtablissements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/salles", {
        nom,
        capacite,
        type,
        etablissement_id: etablissementId,
      });
      setMessage({ type: "success", text: "Salle créée avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    }
  };

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
      <Form onSubmit={handleSubmit} title="Créer une Salle">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="nom de la salle"
          required
        />

        <Label htmlFor="capacite">Capacité</Label>
        <Input
          name="capacite"
          type="number"
          placeholder="capacite de la salle"
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
          options={etablissements.map((e) => ({ value: e.id, label: e.nom }))}
          disabled={etablissements.length === 1}
          required
        />

        <div className="flex">
          <BackButton />
          <Button type="submit">Créer</Button>
        </div>
      </Form>
    </>
  );
};

export default CreateSalle;
