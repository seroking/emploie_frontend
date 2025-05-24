import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateModule = () => {
  // Exemple de filières, à remplacer par un fetch si besoin
  const filieres = [
    { id: 1, nom: "Informatique" },
    { id: 2, nom: "Mathématiques" },
  ];

  const typesEFM = [
    { value: "controle", label: "Contrôle" },
    { value: "projet", label: "Projet" },
    { value: "examen", label: "Examen" },
  ];

  const semestres = [
    { value: 1, label: "Semestre 1" },
    { value: 2, label: "Semestre 2" },
    { value: 3, label: "Semestre 3" },
    { value: 4, label: "Semestre 4" },
  ];

  const anneesFormation = [
    { value: 2023, label: "2023" },
    { value: 2024, label: "2024" },
    { value: 2025, label: "2025" },
  ];
  const [nom, setNom] = useState("");
  const [masseHorairePresentiel, setMasseHorairePresentiel] = useState("");
  const [masseHoraireDistanciel, setMasseHoraireDistanciel] = useState("");
  const [typeEfm, setTypeEfm] = useState("");
  const [semestre, setSemestre] = useState("");
  const [anneeFormation, setAnneeFormation] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez envoyer les données à l'API
    setMessage({ type: "success", text: "Module créé avec succès." });
    setTimeout(() => navigate("/modules"), 1500);
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="nom">Nom du module</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="masseHorairePresentiel">Masse horaire présentiel</Label>
        <Input
          name="masseHorairePresentiel"
          type="number"
          value={masseHorairePresentiel}
          onChange={(e) => setMasseHorairePresentiel(e.target.value)}
          required
        />

        <Label htmlFor="masseHoraireDistanciel">Masse horaire distanciel</Label>
        <Input
          name="masseHoraireDistanciel"
          type="number"
          value={masseHoraireDistanciel}
          onChange={(e) => setMasseHoraireDistanciel(e.target.value)}
          required
        />

        <Label htmlFor="typeEfm">Type EFM</Label>
        <Select
          name="typeEfm"
          value={typeEfm}
          onChange={(e) => setTypeEfm(e.target.value)}
          options={typesEFM}
          required
        />

        <Label htmlFor="semestre">Semestre</Label>
        <Select
          name="semestre"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
          options={semestres}
          required
        />

        <Label htmlFor="anneeFormation">Année de formation</Label>
        <Select
          name="anneeFormation"
          value={anneeFormation}
          onChange={(e) => setAnneeFormation(e.target.value)}
          options={anneesFormation}
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

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateModule;
