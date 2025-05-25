import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateFormateur = () => {
  const navigate = useNavigate();
  const [utilisateurId, setUtilisateurId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [heuresHebdo, setHeuresHebdo] = useState("");
  const [message, setMessage] = useState(null);

  const utilisateurs = [
    { value: 1, label: "Utilisateur 1" },
    { value: 2, label: "Utilisateur 2" },
  ];
  const etablissements = [
    { value: 1, label: "Lycée A" },
    { value: 2, label: "Lycée B" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Formateur créé avec succès." });
    setTimeout(() => navigate("/formateurs"), 1500);
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label>Utilisateur</Label>
        <Select
          value={utilisateurId}
          onChange={(e) => setUtilisateurId(e.target.value)}
          options={utilisateurs}
        />

        <Label>Établissement</Label>
        <Select
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements}
        />

        <Label>Spécialité</Label>
        <Input
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
        />

        <Label>Heures Hebdomadaires</Label>
        <Input
          type="number"
          value={heuresHebdo}
          onChange={(e) => setHeuresHebdo(e.target.value)}
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFormateur;
