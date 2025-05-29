import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateSemaine = () => {
  const [numeroSemaine, setNumeroSemaine] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [anneeScolaireId, setAnneeScolaireId] = useState("");
  const [anneesScolaires, setAnneesScolaires] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnneesScolaires = async () => {
      try {
        const res = await API.get("/annees-scolaires");
        setAnneesScolaires(res.data.data);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des années scolaires.",
        });
      }
    };

    fetchAnneesScolaires();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/semaines", {
        numero_semaine: numeroSemaine,
        date_debut: dateDebut,
        date_fin: dateFin,
        annee_scolaire_id: anneeScolaireId,
      });
      setMessage({ type: "success", text: "Semaine créée avec succès." });
      setTimeout(() => navigate("/semaines"), 1500);
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
