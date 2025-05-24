import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditSecteur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSecteur = () => {
      setTimeout(() => {
        const secteurs = [
          { id: 1, nom: "Santé" },
          { id: 2, nom: "Industrie" },
        ];
        const found = secteurs.find((s) => s.id === parseInt(id));
        if (found) setNom(found.nom);
        setIsLoading(false);
      }, 500);
    };

    fetchSecteur();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Secteur modifié avec succès." });
    setTimeout(() => navigate("/secteurs"), 1500);
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
        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditSecteur;
