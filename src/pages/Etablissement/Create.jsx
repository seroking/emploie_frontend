import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";

const CreateEtablissement = () => {
  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurId, setDirecteurId] = useState("");
  const [complexeId, setComplexeId] = useState("");
  const [directeurs, setDirecteurs] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await API.get("/etablissements");

        // directeurs : tableau à partir de res.data.directeurs
        setDirecteurs(
          res.data.directeurs.map((d) => ({
            value: d.id,
            label: d.utilisateur.nom,
          }))
        );

        // complexe : c’est un objet, on le transforme en tableau pour map
        if (res.data.complexe) {
          setComplexes([
            {
              value: res.data.complexe.id,
              label: res.data.complexe.nom,
            },
          ]);
          setComplexeId(res.data.complexe.id); // Optionnel : présélectionne le complexe
        } else {
          setComplexes([]);
        }
      } catch (err) {
        setMessage({ type: "error", text: "Erreur chargement des données." });
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/etablissements", {
        nom,
        adresse,
        telephone,
        directeur_etablissement_id: directeurId,
        complexe_id: complexeId,
      });
      setMessage({ type: "success", text: "Etablissement créé avec succès." });
      setTimeout(() => navigate("/etablissements"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur.",
      });
    }
  };

  return (
    <>
      {message && <Message type={message.type} text={message.text} />}
      <Form onSubmit={handleSubmit} title="Créer un établissement">
        <Label htmlFor="nom">Nom</Label>
        <Input
          name="nom"
          placeholder="nom d'établissement"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <Label htmlFor="adresse">Adresse</Label>
        <Input
          name="adresse"
          telephone="adresse"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />

        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          name="telephone"
          placeholder="telephone"
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
          disabled={complexes.length === 1} // si un seul complexe, désactive la sélection (optionnel)
        />

        <Button type="submit">Créer</Button>
      </Form>
    </>
  );
};

export default CreateEtablissement;
