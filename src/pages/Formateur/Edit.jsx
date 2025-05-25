import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditFormateur = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [utilisateurId, setUtilisateurId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [heuresHebdo, setHeuresHebdo] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const utilisateurs = [
    { value: 1, label: "Utilisateur 1" },
    { value: 2, label: "Utilisateur 2" },
  ];
  const etablissements = [
    { value: 1, label: "Lycée A" },
    { value: 2, label: "Lycée B" },
  ];

  useEffect(() => {
    const formateurs = [
      {
        id: 1,
        utilisateur_id: 1,
        etablissement_id: 1,
        specialite: "Mathématiques",
        heures_hebdomadaire: 18,
      },
      {
        id: 2,
        utilisateur_id: 2,
        etablissement_id: 1,
        specialite: "Physique",
        heures_hebdomadaire: 20,
      },
    ];

    const f = formateurs.find((f) => f.id === parseInt(id));
    if (f) {
      setUtilisateurId(f.utilisateur_id);
      setEtablissementId(f.etablissement_id);
      setSpecialite(f.specialite);
      setHeuresHebdo(f.heures_hebdomadaire);
    }

    setLoading(false);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Formateur modifié avec succès." });
    setTimeout(() => navigate("/formateurs"), 1500);
  };

  if (loading) return <div>Chargement...</div>;

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

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditFormateur;
