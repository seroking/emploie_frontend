import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditSemaine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numeroSemaine, setNumeroSemaine] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [anneeScolaireId, setAnneeScolaireId] = useState("");
  const [anneesScolaires, setAnneesScolaires] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const anneesRes = await API.get("/annees-scolaires");
        setAnneesScolaires(anneesRes.data.data);

        const semaineRes = await API.get(`/semaines/${id}`);
        const semaine = semaineRes.data.data;
        setNumeroSemaine(semaine.numero_semaine);
        setDateDebut(semaine.date_debut);
        setDateFin(semaine.date_fin);
        setAnneeScolaireId(semaine.annee_scolaire_id);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des données.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/semaines/${id}`, {
        numero_semaine: numeroSemaine,
        date_debut: dateDebut,
        date_fin: dateFin,
        annee_scolaire_id: anneeScolaireId,
      });
      setMessage({ type: "success", text: "Semaine modifiée avec succès." });
      setTimeout(() => navigate("/semaines"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (isLoading) return <div>Chargement...</div>;

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

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditSemaine;
