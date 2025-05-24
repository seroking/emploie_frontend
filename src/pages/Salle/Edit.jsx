import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditSalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nom, setNom] = useState("");
    const [capacite, setCapacite] = useState("");
    const [type, setType] = useState("");
    const [etablissementId, setEtablissementId] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulated data
    const etablissements = [
        { id: 1, nom: "Lycée Jean Moulin" },
        { id: 2, nom: "Collège Victor Hugo" },
    ];

    useEffect(() => {
        const fetchSalle = () => {
            setIsLoading(true);
            setTimeout(() => {
                const salles = [
                    {
                        id: 1,
                        nom: "Salle A",
                        capacite: 30,
                        type: "Classe",
                        etablissement_id: 1,
                    },
                    {
                        id: 2,
                        nom: "Salle B",
                        capacite: 50,
                        type: "Laboratoire",
                        etablissement_id: 2,
                    },
                ];
                const found = salles.find((s) => s.id === parseInt(id));
                if (found) {
                    setNom(found.nom);
                    setCapacite(found.capacite);
                    setType(found.type);
                    setEtablissementId(found.etablissement_id);
                }
                setIsLoading(false);
            }, 500);
        };

        fetchSalle();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "success", text: "Salle modifiée avec succès." });
        setTimeout(() => navigate("/salles"), 1500);
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
                    options={[
                        { value: "Classe", label: "Classe" },
                        { value: "Laboratoire", label: "Laboratoire" },
                        { value: "Amphithéâtre", label: "Amphithéâtre" },
                    ]}
                    required
                />

                <Label htmlFor="etablissementId">Établissement</Label>
                <Select
                    name="etablissementId"
                    value={etablissementId}
                    onChange={(e) => setEtablissementId(e.target.value)}
                    options={etablissements.map((e) => ({
                        value: e.id,
                        label: e.nom,
                    }))}
                    required
                />

                <Button type="submit">Modifier</Button>
            </Form>
        </>
    );
};

export default EditSalle;