import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateFiliere = () => {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Filière créée avec succès." });
    setTimeout(() => navigate("/filieres"), 1500);
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
        />
        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFiliere;
