import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const EditEtablissement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurId, setDirecteurId] = useState("");
  const [complexeId, setComplexeId] = useState("");
  const [directeurs, setDirecteurs] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etablissement, directeursRes, complexesRes] = await Promise.all([
          API.get(`/etablissements/${id}`),
          API.get("/directeur-etablissements"),
          API.get("/complexes")
        ]);
        
        const data = etablissement.data.data;
        setNom(data.nom);
        setAdresse(data.adresse);
        setTelephone(data.telephone);
        setDirecteurId(data.directeur_etablissement_id);
        setComplexeId(data.complexe_id);
        
        setDirecteurs(directeursRes.data.data);
        setComplexes(complexesRes.data.data);
      } catch (error) {
        setMessage({ 
          type: "error", 
          text: "Erreur lors du chargement des données" 
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
      await API.put(`/etablissements/${id}`, {
        nom: nom.trim(),
        adresse: adresse.trim(),
        telephone: telephone.trim(),
        directeur_etablissement_id: directeurId,
        complexe_id: complexeId
      });
      setMessage({ type: "success", text: "Établissement modifié avec succès." });
      setTimeout(() => navigate("/etablissements"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification"
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

        <Label htmlFor="directeurId">Directeur</Label>
        <Select
          name="directeurId"
          value={directeurId}
          onChange={(e) => setDirecteurId(e.target.value)}
          options={directeurs.map((d) => ({ 
            value: d.id, 
            label: d.nom 
          }))}
          required
        />

        <Label htmlFor="complexeId">Complexe</Label>
        <Select
          name="complexeId"
          value={complexeId}
          onChange={(e) => setComplexeId(e.target.value)}
          options={complexes.map((c) => ({ 
            value: c.id, 
            label: c.nom 
          }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditEtablissement;
