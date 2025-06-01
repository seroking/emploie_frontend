import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditFiliere = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [secteurId, setSecteurId] = useState("");
  const [secteurs, setSecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filiereRes = await API.get(`/filieres/${id}`); // Fetch specific filiere
        const secteursRes = await API.get("/secteurs"); // Fetch secteurs

        const filiere = filiereRes.data.data;
        setNom(filiere.nom);
        setSecteurId(filiere.secteur_id);

        setSecteurs(secteursRes.data.data);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/filieres/${id}`, { nom, secteur_id: secteurId }); // Send PUT request
      setMessage({ type: "success", text: "Filière modifiée avec succès." });
      setTimeout(() => navigate("/filieres"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Erreur lors de la modification.",
      });
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
          required
        />

        <Label htmlFor="secteurId">Secteur</Label>
        <Select
          name="secteurId"
          value={secteurId}
          onChange={(e) => setSecteurId(e.target.value)}
          options={secteurs.map((s) => ({ value: s.id, label: s.nom }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditFiliere;
