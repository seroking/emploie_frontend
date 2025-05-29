import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateDirectionRegional = () => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add validation
    if (!nom.trim()) {
      setMessage({ type: "error", text: "Le nom est requis." });
      return;
    }
    if (!adresse.trim()) {
      setMessage({ type: "error", text: "L'adresse est requise." });
      return;
    }
    if (!telephone.trim()) {
      setMessage({ type: "error", text: "Le téléphone est requis." });
      return;
    }

    try {
      await API.post("/directions-regionales", {
        nom: nom.trim(),
        adresse: adresse.trim(),
        telephone: telephone.trim(),
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
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom de la direction"
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          name="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          placeholder="Adresse complète"
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          placeholder="Numéro de téléphone"
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateDirectionRegional;
