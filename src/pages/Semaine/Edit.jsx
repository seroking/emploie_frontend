import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditSemaine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numeroSemaine, setNumeroSemaine] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [anneeScolaireId, setAnneeScolaireId] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const anneesScolaires = [
    { id: 1, nom: "2024-2025" },
    { id: 2, nom: "2025-2026" },
  ];

  useEffect(() => {
    const fetchSemaine = () => {
      setIsLoading(true);
      setTimeout(() => {
        const semaines = [
          {
            id: 1,
            numero_semaine: 1,
            date_debut: "2024-09-02",
            date_fin: "2024-09-08",
            annee_scolaire_id: 1,
          },
        ];
        const found = semaines.find((s) => s.id === parseInt(id));
        if (found) {
          setNumeroSemaine(found.numero_semaine);
          setDateDebut(found.date_debut);
          setDateFin(found.date_fin);
          setAnneeScolaireId(found.annee_scolaire_id);
        }
        setIsLoading(false);
      }, 500);
    };

    fetchSemaine();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Semaine modifiée avec succès." });
    setTimeout(() => navigate("/semaines"), 1500);
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
