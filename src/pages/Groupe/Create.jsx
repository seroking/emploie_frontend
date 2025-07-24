import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import BackButton from "../../components/ui/BackButton";

const CreateGroupe = () => {
  const [nom, setNom] = useState("");
  const [annee, setAnnee] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [etablissementId, setEtablissementId] = useState(null);
  const [filieres, setFilieres] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/groupes");
        setFilieres(res.data.filieres);
        setEtablissements([res.data.etablissement]); // Backend returns a single etablissement
        setEtablissementId(res.data.etablissement.id);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des données.",
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/groupes", {
        nom,
        annee,
        filiere_id: filiereId,
        etablissement_id: etablissementId,
      });
      setMessage({ type: "success", text: "Groupe créé avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    }
  };

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
      <Form onSubmit={handleSubmit} title="Créer un Groupe">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="nom"
          required
        />
        <Label htmlFor="annee">Année</Label>
        <Select
          name="annee"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          options={[
            { value: "1ére année", label: "1ére année" },
            { value: "2éme année", label: "2éme année" },
            { value: "3éme année", label: "3éme année" },
          ]}
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
          disabled={etablissements.length === 1}
          required
        />
        <div className="flex">
          <BackButton />
          <Button type="submit">Créer</Button>
        </div>
      </Form>
    </>
  );
};

export default CreateGroupe;
