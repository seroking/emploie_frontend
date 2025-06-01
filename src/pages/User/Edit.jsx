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
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get(`/utilisateurs/${id}`); // Correct endpoint
        const user = response.data.data;
        setNom(user.nom);
        setEmail(user.email);
        setRole(user.role);
        setLoading(false);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement de l'utilisateur.",
        });
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/utilisateurs/${id}`, {
        nom,
        email,
        role,
      }); // Correct endpoint
      setMessage({ type: "success", text: "Utilisateur modifié avec succès." });
      setTimeout(() => navigate("/users"), 1500);
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
          options={[
            { value: "DirecteurSuper", label: "Directeur Super" },
            { value: "DirecteurRegional", label: "Directeur Régional" },
            { value: "DirecteurComplexe", label: "Directeur Complexe" },
            { value: "DirecteurEtablissement", label: "Directeur Établissement" },
            { value: "Formateur", label: "Formateur" },
            { value: "Stagiaire", label: "Stagiaire" },
          ]}
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
