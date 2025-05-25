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
  const [directions, setDirections] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Charger dynamiquement les directions régionales
  useEffect(() => {
    API.get("/directions-regionales")
      .then((res) => {
        setDirections(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.nom,
          }))
        );
      })
      .catch(() =>
        setMessage({ type: "error", text: "Erreur de chargement des directions régionales." })
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/complexes", {
        nom,
        direction_regional_id: directionRegionalId,
      });
      setMessage({ type: "success", text: "Complexe créé avec succès." });
      setTimeout(() => navigate("/complexes"), 1500);
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

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateComplexe;
