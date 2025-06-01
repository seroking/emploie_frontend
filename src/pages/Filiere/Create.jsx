import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateFiliere = () => {
  const [nom, setNom] = useState("");
  const [secteurId, setSecteurId] = useState("");
  const [secteurs, setSecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const response = await API.get("/secteurs"); // Fetch secteurs
        setSecteurs(response.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des secteurs.",
        });
      }
    };

    fetchSecteurs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/filieres", { nom, secteur_id: secteurId }); // Send POST request
      setMessage({ type: "success", text: "Filière créée avec succès." });
      setTimeout(() => navigate("/filieres"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    }
  };

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

        <Label htmlFor="secteurId">Secteur</Label>
        <Select
          name="secteurId"
          value={secteurId}
          onChange={(e) => {
            console.log(e.target.value);
            setSecteurId(e.target.value);
          }}
          options={[
            { value: "", label: "Sélectionnez un secteur" }, // Default void option
            ...secteurs.map((s) => ({ value: s.id, label: s.nom })),
          ]}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateFiliere;
