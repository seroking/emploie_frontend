import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Formateur");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement de données
    const utilisateurs = [
      {
        id: 1,
        nom: "Jean Dupont",
        email: "jean@example.com",
        role: "Formateur",
      },
      {
        id: 2,
        nom: "Marie Curie",
        email: "marie@example.com",
        role: "Directeur",
      },
    ];
    const utilisateur = utilisateurs.find((u) => u.id === parseInt(id));
    if (utilisateur) {
      setNom(utilisateur.nom);
      setEmail(utilisateur.email);
      setRole(utilisateur.role);
    }
    setLoading(false);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Utilisateur modifié avec succès." });
    setTimeout(() => navigate("/users"), 1500);
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

        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label htmlFor="role">Rôle</Label>
        <Select
          name="role"
          options={[
            { value: "Formateur", label: "Formateur" },
            { value: "Directeur", label: "Directeur" },
          ]}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditUser;
