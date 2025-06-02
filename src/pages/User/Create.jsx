import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateUser = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [creatableRoles, setCreatableRoles] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await API.get("/utilisateurs"); // Fetch creatable roles
        if (response.data.roles) {
          setCreatableRoles(
            response.data.roles.map((role) => ({
              value: role,
              label: role,
            }))
          );
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des rôles disponibles.",
        });
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom.trim() || !email.trim() || !password.trim() || !role.trim()) {
      setMessage({ type: "error", text: "Tous les champs sont requis." });
      return;
    }

    try {
      await API.post("/register", {
        nom: nom.trim(),
        email: email.trim(),
        password: password,
        role: role,
      });

      setMessage({ type: "success", text: "Utilisateur créé avec succès." });
      setTimeout(() => navigate("/utilisateurs"), 1500);
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

        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Label htmlFor="password">Mot de passe</Label>
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Label htmlFor="role">Rôle</Label>
        <Select
          name="role"
          options={creatableRoles}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateUser;
