import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";

const EditFormateur = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [specialite, setSpecialite] = useState("");
  const [heuresHebdomadaire, setHeuresHebdomadaire] = useState("");
  const [utilisateurId, setUtilisateurId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [complexeId, setComplexeId] = useState("");
  const [directionRegionalId, setDirectionRegionalId] = useState("");
  const [peutGererSeance, setPeutGererSeance] = useState(false);

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [directionsRegionales, setDirectionsRegionales] = useState([]);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = API.get("/formateurs");
    const fetchFormateur = API.get(`/formateurs/${id}`);

    Promise.all([fetchOptions, fetchFormateur])
      .then(([optionsRes, formateurRes]) => {
        // Options pour les selects
        setUtilisateurs(optionsRes.data.utilisateurs || []);
        setEtablissements(optionsRes.data.etablissements || []);
        setComplexes(optionsRes.data.complexes || []);
        setDirectionsRegionales(optionsRes.data.direction_regionales || []);

        // Préremplir les champs
        const f = formateurRes.data.data;
        setSpecialite(f.specialite || "");
        setHeuresHebdomadaire(f.heures_hebdomadaire?.toString() || "");
        setUtilisateurId(f.utilisateur_id || "");
        setEtablissementId(f.etablissement_id || "");
        setComplexeId(f.complexe_id || "");
        setDirectionRegionalId(f.direction_regional_id || "");
        setPeutGererSeance(f.utilisateur?.role === "DirecteurEtablissement");
      })
      .catch(() => {
        setMessage({ type: "error", text: "Erreur lors du chargement des données." });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/formateurs/${id}`, {
        specialite,
        heures_hebdomadaire: Number(heuresHebdomadaire),
        utilisateur_id: utilisateurId,
        etablissement_id: etablissementId,
        complexe_id: complexeId,
        direction_regional_id: directionRegionalId,
        ...(user?.role === "DirecteurEtablissement" && {
          peut_gerer_seance: peutGererSeance,
        }),
      });

      setMessage({ type: "success", text: "Formateur modifié avec succès." });
      setTimeout(() => navigate("/formateurs"), 1500);
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Erreur lors de la modification." });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} className="space-y-4" title="Modifier Formateur">
        <Label htmlFor="specialite">Spécialité</Label>
        <Input
          name="specialite"
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
          required
        />

        <Label htmlFor="heures_hebdomadaire">Heures Hebdomadaires</Label>
        <Input
          name="heures_hebdomadaire"
          type="number"
          value={heuresHebdomadaire}
          onChange={(e) => setHeuresHebdomadaire(e.target.value)}
          min={1}
          required
        />

        <Label htmlFor="utilisateur_id">Utilisateur</Label>
        <Select
          name="utilisateur_id"
          value={utilisateurId}
          onChange={(e) => setUtilisateurId(e.target.value)}
          options={utilisateurs.map((u) => ({ value: u.id, label: u.nom }))}
          required
        />

        <Label htmlFor="etablissement_id">Établissement</Label>
        <Select
          name="etablissement_id"
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements.map((e) => ({ value: e.id, label: e.nom }))}
          required
        />

        <Label htmlFor="complexe_id">Complexe</Label>
        <Select
          name="complexe_id"
          value={complexeId}
          onChange={(e) => setComplexeId(e.target.value)}
          options={complexes.map((c) => ({ value: c.id, label: c.nom }))}
          required
        />

        <Label htmlFor="direction_regional_id">Direction Régionale</Label>
        <Select
          name="direction_regional_id"
          value={directionRegionalId}
          onChange={(e) => setDirectionRegionalId(e.target.value)}
          options={directionsRegionales.map((d) => ({ value: d.id, label: d.nom }))}
          required
        />

        {user?.role === "DirecteurEtablissement" && (
          <>
            <Label htmlFor="peut_gerer_seance">Peut gérer les séances</Label>
            <input
              type="checkbox"
              name="peut_gerer_seance"
              id="peut_gerer_seance"
              checked={peutGererSeance}
              onChange={(e) => setPeutGererSeance(e.target.checked)}
              className="ml-2"
            />
          </>
        )}

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditFormateur;
