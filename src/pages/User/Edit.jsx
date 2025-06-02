import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editableRoles, setEditableRoles] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUser, resRoles] = await Promise.all([
          API.get(`/utilisateurs/${id}`),
          API.get("/utilisateurs"),
        ]);

        const user = resUser.data.data;
        setNom(user.nom);
        setEmail(user.email);
        setRole(user.role);
        setLoading(false);

        if (resRoles.data.roles) {
          setEditableRoles(
            resRoles.data.roles.map((r) => ({
              value: r,
              label: r,
            }))
          );
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données utilisateur ou des rôles.",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/utilisateurs/${id}`, {
        nom,
        email,
        role,
      });
      setMessage({ type: "success", text: "Utilisateur modifié avec succès." });
      setTimeout(() => navigate("/utilisateurs"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
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

        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Label htmlFor="role">Rôle</Label>
        <Select
          name="role"
          options={editableRoles}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditUser;
