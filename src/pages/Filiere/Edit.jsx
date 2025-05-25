import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditFiliere = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filieres = [
      { id: 1, nom: "Informatique" },
      { id: 2, nom: "Gestion" },
    ];
    const filiere = filieres.find((f) => f.id === parseInt(id));
    if (filiere) setNom(filiere.nom);
    setLoading(false);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Filière modifiée avec succès." });
    setTimeout(() => navigate("/filieres"), 1500);
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
        />
        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditFiliere;
