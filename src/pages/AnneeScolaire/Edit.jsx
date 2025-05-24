import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditAnneeScolaire = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour chaque champ du formulaire
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const etablissements = [
    { value: 1, label: "Etablissement A" },
    { value: 2, label: "Etablissement B" },
  ];

  useEffect(() => {
    API.get(`/annees-scolaires/${id}`)
      .then((res) => {
        const annee = res.data.data;
        setNom(annee.nom);
        setDateDebut(annee.date_debut);
        setDateFin(annee.date_fin);
        setEtablissementId(annee.etablissement_id);
        setLoading(false);
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
        etablissement_id: etablissementId,
      });
      setMessage({
        type: "success",
        text: "Année scolaire modifiée avec succès.",
      });
      setTimeout(() => navigate("/annees-scolaires"), 1500);
    } catch {
      setMessage({ type: "error", text: "Erreur lors de la modification." });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
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

        <Label htmlFor="etablissement_id">Etablissement</Label>
        <Select
          name="etablissement_id"
          options={etablissements}
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditAnneeScolaire;
