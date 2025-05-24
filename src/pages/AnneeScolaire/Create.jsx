import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateAnneeScolaire = () => {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/annees-scolaires", {
        nom,
        date_debut: dateDebut,
        date_fin: dateFin,
      });
      setMessage({ type: "success", text: "Année scolaire créée avec succès." });
      setTimeout(() => navigate("/annees-scolaires"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Erreur lors de la création." });
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
          placeholder="Nom de l'année"
        />

        <Label htmlFor="date_debut">Date Début</Label>
        <Input
          type="date"
          name="date_debut"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
        />

        <Label htmlFor="date_fin">Date Fin</Label>
        <Input
          type="date"
          name="date_fin"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateAnneeScolaire;
