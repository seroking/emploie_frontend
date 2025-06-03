import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateDirectionRegional = () => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurRegionalId, setDirecteurRegionalId] = useState("");
  const [directeurs, setDirecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDirecteurs = async () => {
      try {
        const response = await API.get("/directeurs-regionales");
        setDirecteurs(
          response.data.data.map((d) => ({
            value: d.id,
            label: d.utilisateur.nom,
          }))
        );
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des directeurs régionaux.",
        });
      }
    };

    fetchDirecteurs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/directions-regionales", {
        nom,
        adresse,
        telephone,
        directeur_regional_id: directeurRegionalId,
      });
      setMessage({ type: "success", text: "Direction régionale créée avec succès." });
      setTimeout(() => navigate("/directions-regionales"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    }
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Créer une direction regional">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          name="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />

        <Label htmlFor="directeurRegionalId">Directeur Régional</Label>
        <Select
          name="directeurRegionalId"
          value={directeurRegionalId}
          onChange={(e) => setDirecteurRegionalId(e.target.value)}
          options={directeurs}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateDirectionRegional;
