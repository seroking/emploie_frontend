import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditComplexe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [directionRegionalId, setDirectionRegionalId] = useState("");
  const [directions, setDirections] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch directions and complexe data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch directions
        const directionsRes = await API.get("/directions-regionales");
        setDirections(
          directionsRes.data.data.map((d) => ({
            value: d.id,
            label: d.nom,
          }))
        );

        // Fetch complexe data
        const complexeRes = await API.get(`/complexes/${id}`);
        setNom(complexeRes.data.data.nom);
        setDirectionRegionalId(complexeRes.data.data.direction_regional_id); // Ensure this matches the `value` in `directions`
      } catch (err) {
        setMessage({ type: "error", text: "Erreur de chargement des données." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      await API.put(`/complexes/${id}`, {
        nom,
        direction_regional_id: directionRegionalId,
      });
      setMessage({ type: "success", text: "Complexe modifié avec succès." });
      setTimeout(() => navigate("/complexes"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
      });
    } finally {
      setLoadingSubmit(false);
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
        />

        <Label htmlFor="direction_regional_id">Direction Régionale</Label>
        <Select
          name="direction_regional_id"
          options={directions}
          value={directionRegionalId}
          onChange={(e) => setDirectionRegionalId(e.target.value)}
        />

        <Button type="submit" disabled={loadingSubmit}>
          {loadingSubmit ? "Modification en cours..." : "Modifier"}
        </Button>
      </Form>
    </>
  );
};

export default EditComplexe;
