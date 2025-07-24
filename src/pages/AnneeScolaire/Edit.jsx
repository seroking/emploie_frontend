import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditAnneeScolaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour chaque champ du formulaire
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/annees-scolaires/${id}`)
      .then((res) => {
        const annee = res.data.data;
        setNom(annee.nom);
        setDateDebut(annee.date_debut);
        setDateFin(annee.date_fin);
        setLoading(false);
        console.log(annee);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/annees-scolaires/${id}`, {
        nom,
        date_debut: dateDebut,
        date_fin: dateFin,
      });
      setMessage({
        type: "success",
        text: "Année scolaire modifiée avec succès.",
      });
    } catch {
      console.error(err.response || err);
      setMessage({ type: "error", text: "Erreur lors de la modification." });
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      {message && (
        <Message
          type={message.type}
          text={message.text}
          onConfirm={
            message.type === "success" ? () => navigate(-1) : undefined
          }
        />
      )}
      <Form onSubmit={handleSubmit} title="Modifier une année scolaire">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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
        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditAnneeScolaire;
