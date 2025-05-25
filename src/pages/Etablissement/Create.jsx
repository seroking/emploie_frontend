import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateEtablissement = () => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurId, setDirecteurId] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const directeurs = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Curie" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Établissement créé avec succès." });
    setTimeout(() => navigate("/etablissements"), 1500);
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

        <Label htmlFor="directeurId">Directeur</Label>
        <Select
          name="directeurId"
          value={directeurId}
          onChange={(e) => setDirecteurId(e.target.value)}
          options={directeurs.map((d) => ({ value: d.id, label: d.nom }))}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateEtablissement;
