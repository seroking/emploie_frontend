import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import BackButton from "../../components/ui/BackButton";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateSectEfp = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [secteurId, setSecteurId] = useState();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSectEfp = async () => {
      try {
        const response = await API.get("/secteurs-etablissements");
        setSecteurs(response.data.secteurs);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des secteurs et établissements.",
        });
      }
    };
    fetchSectEfp();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/secteurs-etablissements", {
        secteur_id: secteurId,
      });
      setMessage({ type: "success", text: "sect/efp créée avec succès." });
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
      <Form
        onSubmit={handleSubmit}
        title="Créer une nouvelle association Secteur-Etablissement"
      >
        <Label htmlFor="secteurId">Secteur</Label>
        <Select
          name="secteur_id"
          value={secteurId}
          onChange={(e) => {
            console.log(e.target.value);
            setSecteurId(e.target.value);
          }}
          options={[...secteurs.map((s) => ({ value: s.id, label: s.nom }))]}
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
export default CreateSectEfp;
