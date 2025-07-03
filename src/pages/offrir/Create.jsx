import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateOffrir = () => {
  const [filieres, setFilieres] = useState([]);
  const [filiereId, setFiliereId] = useState();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/offres-formations");
        setFilieres(response.data.filieres);
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
      await API.post("/offres-formations", {
        filiere_id: filiereId,
      });
      setMessage({
        type: "success",
        text: "Offre de formation créée avec succès.",
      });
      setTimeout(() => navigate("/offres-formations"), 1500);
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
      <Form
        onSubmit={handleSubmit}
        title="Créer une nouvelle offre de formation"
      >
        <Label htmlFor="filiereId">Filière</Label>
        <Select
          name="filiere_id"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          options={filieres.map((f) => ({
            value: f.id,
            label: f.nom,
          }))}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateOffrir;
