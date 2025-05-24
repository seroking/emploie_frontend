import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditGroupe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États individuels pour chaque champ
  const [nom, setNom] = useState("");
  const [annee, setAnnee] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [etablissementId, setEtablissementId] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simule les données (à remplacer par API ou contexte réel)
  const filieres = [
    { id: 1, nom: "Informatique" },
    { id: 2, nom: "Commerce" },
  ];

  const etablissements = [
    { id: 1, nom: "Lycée Jean Moulin" },
    { id: 2, nom: "Collège Victor Hugo" },
  ];

  useEffect(() => {
    // Simule récupération groupe
    const fetchGroupe = () => {
      setIsLoading(true);
      // Simulation de requête API
      setTimeout(() => {
        const groupes = [
          {
            id: 1,
            nom: "Groupe 1",
            annee: "2023-2024",
            filiere_id: 1,
            etablissement_id: 1,
          },
          {
            id: 2,
            nom: "Groupe 2",
            annee: "2023-2024",
            filiere_id: 2,
            etablissement_id: 2,
          },
        ];

        const found = groupes.find((g) => g.id === parseInt(id));
        if (found) {
          setNom(found.nom);
          setAnnee(found.annee);
          setFiliereId(found.filiere_id);
          setEtablissementId(found.etablissement_id);
        }
        setIsLoading(false);
      }, 500);
    };

    fetchGroupe();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Groupe modifié avec succès." });
    setTimeout(() => navigate("/groupes"), 1500);
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="annee">Année scolaire</Label>
        <Input
          name="annee"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          required
        />

        <Label htmlFor="filiereId">Filière</Label>
        <Select
          name="filiereId"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          options={filieres.map((f) => ({ value: f.id, label: f.nom }))}
          required
        />

        <Label htmlFor="etablissementId">Établissement</Label>
        <Select
          name="etablissementId"
          value={etablissementId}
          onChange={(e) => setEtablissementId(e.target.value)}
          options={etablissements.map((e) => ({ value: e.id, label: e.nom }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditGroupe;
