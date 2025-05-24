import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateGroupe = () => {
  const [nom, setNom] = useState("");
  const [annee, setAnnee] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Simule les données (à remplacer par API ou contexte réel)
  const filieres = [
    { id: 1, nom: "Informatique" },
    { id: 2, nom: "Commerce" },
  ];

  const etablissements = [
    { id: 1, nom: "Lycée Jean Moulin" },
    { id: 2, nom: "Collège Victor Hugo" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Groupe créé avec succès." });
    setTimeout(() => navigate("/groupes"), 1500);
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

        <Label htmlFor="annee">Année scolaire</Label>
        <Input
          name="annee"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          placeholder="2023-2024"
          required
        />

        <Label htmlFor="filiereId">Filière</Label>
        <Select
          name="filiereId"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          options={filieres.map((f) => ({ value: f.id, label: f.nom }))}
          required
        />

        <Label htmlFor="etablissementId">Établissement</Label>
        <Select
          name="etablissementId"
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements.map((e) => ({ value: e.id, label: e.nom }))}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateGroupe;
