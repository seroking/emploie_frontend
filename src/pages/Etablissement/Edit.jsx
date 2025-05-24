import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditEtablissement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [directeurId, setDirecteurId] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const directeurs = [
    { id: 1, nom: "Jean Dupont" },
    { id: 2, nom: "Marie Curie" },
  ];

  useEffect(() => {
    const fetchEtablissement = () => {
      setIsLoading(true);
      setTimeout(() => {
        const etablissements = [
          {
            id: 1,
            nom: "Lycée Jean Moulin",
            adresse: "123 Rue Principale",
            telephone: "0123456789",
            directeur_id: 1,
          },
          {
            id: 2,
            nom: "Collège Victor Hugo",
            adresse: "456 Rue Secondaire",
            telephone: "0987654321",
            directeur_id: 2,
          },
        ];

        const found = etablissements.find((e) => e.id === parseInt(id));
        if (found) {
          setNom(found.nom);
          setAdresse(found.adresse);
          setTelephone(found.telephone);
          setDirecteurId(found.directeur_id);
        }
        setIsLoading(false);
      }, 500);
    };

    fetchEtablissement();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "success", text: "Établissement modifié avec succès." });
    setTimeout(() => navigate("/etablissements"), 1500);
  };

  if (isLoading) return <div>Chargement...</div>;

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
          options={directeurs.map((d) => ({ value: d.id, label: d.nom }))}
          required
        />

        <Button type="submit">Modifier</Button>
      </Form>
    </>
  );
};

export default EditEtablissement;
