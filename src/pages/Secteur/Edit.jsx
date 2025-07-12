import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditSecteur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSecteur = async () => {
      try {
        const res = await API.get(`/secteurs/${id}`); // Fetch secteur by ID
        setNom(res.data.data.nom);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement du secteur.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecteur();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/secteurs/${id}`, { nom }); // Send PUT request to update secteur
      setMessage({ type: "success", text: "Secteur modifié avec succès." });
      setTimeout(() => navigate("/secteurs"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Modifier un Secteur">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditSecteur;
