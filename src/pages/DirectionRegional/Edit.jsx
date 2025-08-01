import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditDirectionRegional = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurRegionalId, setDirecteurRegionalId] = useState("");
  const [directeurs, setDirecteurs] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const directionRes = await API.get(`/directions-regionales/${id}`);
        const directeursRes = await API.get("/directeurs-regionales");

        const direction = directionRes.data.data;
        setNom(direction.nom);
        setAdresse(direction.adresse);
        setTelephone(direction.telephone);
        setDirecteurRegionalId(direction.directeur_regional_id);

        setDirecteurs(
          directeursRes.data.data.map((d) => ({
            value: d.id,
            label: d.utilisateur.nom,
          }))
        );
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/directions-regionales/${id}`, {
        nom,
        adresse,
        telephone,
        directeur_regional_id: directeurRegionalId,
      });
      setMessage({
        type: "success",
        text: "Direction régionale modifiée avec succès.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (loading) return <Loading />;

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
      <Form onSubmit={handleSubmit} title="Modifier une direction regionale">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          name="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          required
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          required
        />

        <Label htmlFor="directeurRegionalId">Directeur Régional</Label>
        <Select
          name="directeurRegionalId"
          value={directeurRegionalId}
          onChange={(e) => setDirecteurRegionalId(e.target.value)}
          options={directeurs}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditDirectionRegional;
