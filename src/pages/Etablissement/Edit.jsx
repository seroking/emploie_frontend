import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        // Récupération des options (directeurs + complexe)
        const optionsRes = await API.get("/etablissements");

        // Récupération des données précises de l'établissement
        const etabRes = await API.get(`/etablissements/${id}`);

        const etab = etabRes.data.data;

        setNom(etab.nom);
        setAdresse(etab.adresse);
        setTelephone(etab.telephone);
        setDirecteurId(etab.directeur_etablissement_id);
        setComplexeId(etab.complexe_id);

        // Mapping des directeurs (tableau)
        setDirecteurs(
          optionsRes.data.directeurs.map((d) => ({
            value: d.id,
            label: d.utilisateur.nom,
          }))
        );

        // Complexe est un objet, on le transforme en tableau avec 1 élément
        if (optionsRes.data.complexe) {
          setComplexes([
            {
              value: optionsRes.data.complexe.id,
              label: optionsRes.data.complexe.nom,
            },
          ]);
        } else {
          setComplexes([]);
        }

        setLoading(false);
      } catch (err) {
        setMessage({ type: "error", text: "Erreur lors du chargement." });
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/etablissements/${id}`, {
        nom,
        adresse,
        telephone,
        directeur_etablissement_id: directeurId,
        complexe_id: complexeId,
      });
      setMessage({ type: "success", text: "Établissement modifié." });
      setTimeout(() => navigate("/etablissements"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Erreur de modification." });
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Modifier Établissement">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          name="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          name="telephone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
        />

        <Label htmlFor="directeur">Directeur</Label>
        <Select
          name="directeur"
          value={directeurId}
          onChange={(e) => setDirecteurId(e.target.value)}
          options={directeurs}
          placeholder="Sélectionnez un directeur"
        />

        <Label htmlFor="complexe">Complexe</Label>
        <Select
          name="complexe"
          value={complexeId}
          onChange={(e) => setComplexeId(e.target.value)}
          options={complexes}
          placeholder="Sélectionnez un complexe"
          disabled={complexes.length === 1} // désactive si un seul complexe
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditEtablissement;
