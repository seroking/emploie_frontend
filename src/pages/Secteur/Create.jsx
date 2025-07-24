import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateSecteur = () => {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/secteurs", { nom }); // Send POST request to create secteur
      setMessage({ type: "success", text: "Secteur créé avec succès." });
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
      <Form onSubmit={handleSubmit} title="Créer un Secteur">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          placeholder="nom du secteur"
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateSecteur;
