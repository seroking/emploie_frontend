import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateUser = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Formateur");
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const roles = [
    { value: "DirecteurSuper", label: "DirecteurSuper" },
    { value: "DirecteurRegional", label: "DirecteurRegional" },
    { value: "DirecteurComplexe", label: "DirecteurComplexe" },
    { value: "DirecteurEtablissement", label: "DirecteurEtablissement" },
    { value: "Formateur", label: "Formateur" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Utilisateur créé avec succès." });
    setTimeout(() => navigate("/users"), 1500);
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
        />

        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Label htmlFor="password">Mot de passe</Label>
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Label htmlFor="role">Rôle</Label>
        <Select
          name="role"
          options={roles}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateUser;
