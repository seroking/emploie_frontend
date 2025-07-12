import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditComplexe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [directionRegionalId, setDirectionRegionalId] = useState("");
  const [directeurComplexeId, setDirecteurComplexeId] = useState("");
  const [directions, setDirections] = useState([]);
  const [directeursComplexes, setDirecteursComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionsRes, complexeRes] = await Promise.all([
          API.get("/complexes"),
          API.get(`/complexes/${id}`),
        ]);

        setDirections(
          optionsRes.data.direction_regionales.map((d) => ({
            value: d.id,
            label: d.nom,
          }))
        );
        setDirecteursComplexes(
          optionsRes.data.directeur_complexes.map((dc) => ({
            value: dc.id,
            label: dc.utilisateur.nom,
          }))
        );

        const complexe = complexeRes.data.data;
        setNom(complexe.nom);
        setDirectionRegionalId(complexe.direction_regional_id);
        setDirecteurComplexeId(complexe.directeur_complexe_id);
      } catch (err) {
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
      await API.put(`/complexes/${id}`, {
        nom,
        directeur_regional_id: directionRegionalId,
        directeur_complexe_id: directeurComplexeId,
      });
      setMessage({ type: "success", text: "Complexe modifié avec succès." });
      setTimeout(() => navigate("/complexes"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Modifier un Complexe">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Nom du complexe"
        />

        <Label htmlFor="direction_regional_id">Direction Régionale</Label>
        <Select
          name="direction_regional_id"
          options={directions}
          value={directionRegionalId}
          onChange={(e) => setDirectionRegionalId(e.target.value)}
        />

        <Label htmlFor="directeur_complexe_id">Directeur Complexe</Label>
        <Select
          name="directeur_complexe_id"
          options={directeursComplexes}
          value={directeurComplexeId}
          onChange={(e) => setDirecteurComplexeId(e.target.value)}
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditComplexe;
