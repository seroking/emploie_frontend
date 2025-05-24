import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const CreateSalle = () => {
    const [nom, setNom] = useState("");
    const [capacite, setCapacite] = useState("");
    const [type, setType] = useState("");
    const [etablissementId, setEtablissementId] = useState("");
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Exemple d'établissements, à remplacer par un fetch si besoin
    const etablissements = [
        { id: 1, nom: "Lycée Victor Hugo" },
        { id: 2, nom: "Collège Jean Moulin" },
    ];

    const typesSalle = [
        { value: "classe", label: "Classe" },
        { value: "laboratoire", label: "Laboratoire" },
        { value: "amphitheatre", label: "Amphithéâtre" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "success", text: "Salle créée avec succès." });
        setTimeout(() => navigate("/salles"), 1500);
    };

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

                <Label htmlFor="capacite">Capacité</Label>
                <Input
                    name="capacite"
                    type="number"
                    value={capacite}
                    onChange={(e) => setCapacite(e.target.value)}
                    required
                />

                <Label htmlFor="type">Type</Label>
                <Select
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    options={typesSalle}
                    required
                />

                <Label htmlFor="etablissementId">Établissement</Label>
                <Select
                    name="etablissementId"
                    value={etablissementId}
                    onChange={(e) => setEtablissementId(e.target.value)}
                    options={etablissements.map((e) => ({ value: e.id, label: e.nom }))}
                    required
                />

                <Button type="submit">Créer</Button>
            </Form>
        </>
    );
};

export default CreateSalle;