import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import Message from "../../components/ui/Message";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Form from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Label from "../../components/ui/Label";

const CreateFormateur = () => {
  // États séparés pour chaque champ
  const [specialite, setSpecialite] = useState("");
  const [heuresHebdomadaire, setHeuresHebdomadaire] = useState("");
  const [utilisateurId, setUtilisateurId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [complexeId, setComplexeId] = useState("");
  const [directionRegionalId, setDirectionRegionalId] = useState("");

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [directionsRegionales, setDirectionsRegionales] = useState([]);

  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/formateurs");
        setUtilisateurs(response.data.utilisateurs || []);
        setEtablissements(response.data.etablissements || []);
        setComplexes(response.data.complexes || []);
        setDirectionsRegionales(response.data.direction_regionales || []);
      } catch (error) {
        setMessage({ type: "error", text: "Erreur lors du chargement des données." });
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/formateurs", {
        specialite,
        heures_hebdomadaire: Number(heuresHebdomadaire),
        utilisateur_id: utilisateurId,
        etablissement_id: etablissementId,
        complexe_id: complexeId,
        direction_regional_id: directionRegionalId,
      });
      setMessage({ type: "success", text: "Formateur créé avec succès." });
      setTimeout(() => navigate("/formateurs"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Erreur lors de la création." });
    }
  };

  return (
    <>

      {message && <Message type={message.type} text={message.text} />}

      <Form onSubmit={handleSubmit} className="space-y-4" title="Cree un formateur">
      <Label htmlFor="specialite">Spécialité</Label>
        <Input
          label="Spécialité"
          name="specialite"
          value={specialite}
          placeholder={"specialite"}
          onChange={(e) => setSpecialite(e.target.value)}
          required
        />
        <Label htmlFor="heures_hebdomadaire">Heures Hebdomadaires</Label>
        <Input
          label="Heures Hebdomadaires"
          name="heures_hebdomadaire"
          type="number"
          placeholder={"heures_hebdomadaire"}
          value={heuresHebdomadaire}
          onChange={(e) => setHeuresHebdomadaire(e.target.value)}
          min={1}
          required
        />
        <Label htmlFor="utilisateur_id">Utilisateur</Label>
        <Select
          label="Utilisateur"
          name="utilisateur_id"
          value={utilisateurId}
          onChange={(e) => setUtilisateurId(e.target.value)}
          options={utilisateurs.map(u => ({ value: u.id, label: u.nom }))}
          required
        />
        <Label htmlFor="etablissement_id">Établissement</Label>
        <Select
          label="Établissement"
          name="etablissement_id"
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements.map(e => ({ value: e.id, label: e.nom }))}
          required
        />
        <Label htmlFor="complexe_id">Complexe</Label>
        <Select
          label="Complexe"
          name="complexe_id"
          value={complexeId}
          onChange={(e) => setComplexeId(e.target.value)}
          options={complexes.map(c => ({ value: c.id, label: c.nom }))}
          required
        />
        <Label htmlFor="direction_regional_id">Direction Régionale</Label>
        <Select
          label="Direction Régionale"
          name="direction_regional_id"
          value={directionRegionalId}
          onChange={(e) => setDirectionRegionalId(e.target.value)}
          options={directionsRegionales.map(d => ({ value: d.id, label: d.nom }))}
          required
        />
        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFormateur;
