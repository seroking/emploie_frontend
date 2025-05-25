import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditFerie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ferie, setFerie] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Exemple de données simulées
    const feries = [
      { id: 1, nom: "Noël", date_debut: "2025-12-24", date_fin: "2025-12-26" },
      {
        id: 2,
        nom: "Nouvel An",
        date_debut: "2026-01-01",
        date_fin: "2026-01-01",
      },
    ];
    const found = feries.find((f) => f.id === parseInt(id));
    if (found) setFerie(found);
    else setFerie(null);
  }, [id]);

  const handleChange = (e) => {
    setFerie({ ...ferie, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Jour férié modifié avec succès." });
    setTimeout(() => navigate("/feries"), 1500);
  };

  if (!ferie) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nom">Nom</Label>
        <Input name="nom" value={ferie.nom} onChange={handleChange} required />

        <Label htmlFor="date_debut">Date de début</Label>
        <Input
          type="date"
          name="date_debut"
          value={ferie.date_debut}
          onChange={handleChange}
          required
        />

        <Label htmlFor="date_fin">Date de fin</Label>
        <Input
          type="date"
          name="date_fin"
          value={ferie.date_fin}
          onChange={handleChange}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditFerie;
