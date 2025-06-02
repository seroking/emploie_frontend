import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateFormateur = () => {
  const navigate = useNavigate();
  const [utilisateurId, setUtilisateurId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [heuresHebdo, setHeuresHebdo] = useState("");
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const utilisateursRes = await API.get("/utilisateurs");
        const etablissementsRes = await API.get("/etablissements");

        setUtilisateurs(
          utilisateursRes.data.data.map((u) => ({
            value: u.id,
            label: u.nom,
          }))
        );

        setEtablissements(
          etablissementsRes.data.data.map((e) => ({
            value: e.id,
            label: e.nom,
          }))
        );
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données.",
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/formateurs", {
        utilisateur_id: utilisateurId,
        etablissement_id: etablissementId,
        specialite,
        heures_hebdomadaire: heuresHebdo,
      });
      setMessage({ type: "success", text: "Formateur créé avec succès." });
      setTimeout(() => navigate("/formateurs"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la création du formateur.",
      });
    }
  };

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

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFormateur;
