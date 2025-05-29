import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditDirectionRegional = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        const response = await API.get(`/directions-regionales/${id}`);
        const direction = response.data.data;
        setNom(direction.nom);
        setAdresse(direction.adresse);
        setTelephone(direction.telephone);
      } catch (error) {
        setMessage({ 
          type: "error", 
          text: "Erreur lors du chargement de la direction régionale" 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDirection();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/directions-regionales/${id}`, {
        nom: nom.trim(),
        adresse: adresse.trim(),
        telephone: telephone.trim(),
      });
      setMessage({ type: "success", text: "Direction régionale modifiée avec succès" });
      setTimeout(() => navigate("/directions-regionales"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Erreur lors de la modification"
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
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          id="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditDirectionRegional;
