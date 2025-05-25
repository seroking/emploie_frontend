import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateSemaine = () => {
  const [numeroSemaine, setNumeroSemaine] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [anneeScolaireId, setAnneeScolaireId] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const anneesScolaires = [
    { id: 1, nom: "2024-2025" },
    { id: 2, nom: "2025-2026" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Semaine créée avec succès." });
    setTimeout(() => navigate("/semaines"), 1500);
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="numero">Numéro de semaine</Label>
        <Input
          name="numero"
          type="number"
          value={numeroSemaine}
          onChange={(e) => setNumeroSemaine(e.target.value)}
          required
        />

        <Label htmlFor="dateDebut">Date début</Label>
        <Input
          name="dateDebut"
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />

        <Label htmlFor="dateFin">Date fin</Label>
        <Input
          name="dateFin"
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />

        <Label htmlFor="anneeScolaireId">Année scolaire</Label>
        <Select
          name="anneeScolaireId"
          value={anneeScolaireId}
          onChange={(e) => setAnneeScolaireId(e.target.value)}
          options={anneesScolaires.map((a) => ({
            value: a.id,
            label: a.nom,
          }))}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateSemaine;
