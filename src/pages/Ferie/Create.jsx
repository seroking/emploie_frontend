import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateFerie = () => {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/feries", {
        nom,
        date_debut: dateDebut,
        date_fin: dateFin,
      });
      setMessage({ type: "success", text: "Jour férié ajouté avec succès." });
      setTimeout(() => navigate("/feries"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de l'ajout.",
      });
    }
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Créer un jour férié">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          placeholder={"Entrez le nom du jour férié"}
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="dateDebut">Date de début</Label>
        <Input
          name="dateDebut"
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />

        <Label htmlFor="dateFin">Date de fin</Label>
        <Input
          name="dateFin"
          type="date"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />
        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFerie;
