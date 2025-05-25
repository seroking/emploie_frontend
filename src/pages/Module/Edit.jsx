import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";

const EditModule = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nom, setNom] = useState("");
    const [code, setCode] = useState("");
    const [semestre, setSemestre] = useState("");
    const [enseignantId, setEnseignantId] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulated data
    const enseignants = [
        { id: 1, nom: "Mme Dupont" },
        { id: 2, nom: "M. Martin" },
    ];

    useEffect(() => {
        const fetchModule = () => {
            setIsLoading(true);
            setTimeout(() => {
                const modules = [
                    {
                        id: 1,
                        nom: "Mathématiques",
                        code: "MATH101",
                        semestre: "S1",
                        enseignant_id: 1,
                    },
                    {
                        id: 2,
                        nom: "Physique",
                        code: "PHY101",
                        semestre: "S2",
                        enseignant_id: 2,
                    },
                ];
                const found = modules.find((m) => m.id === parseInt(id));
                if (found) {
                    setNom(found.nom);
                    setCode(found.code);
                    setSemestre(found.semestre);
                    setEnseignantId(found.enseignant_id);
                }
                setIsLoading(false);
            }, 500);
        };

        fetchModule();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "success", text: "Module modifié avec succès." });
        setTimeout(() => navigate("/modules"), 1500);
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

                <Label htmlFor="code">Code</Label>
                <Input
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />

                <Label htmlFor="semestre">Semestre</Label>
                <Select
                    name="semestre"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    options={[
                        { value: "S1", label: "Semestre 1" },
                        { value: "S2", label: "Semestre 2" },
                        { value: "S3", label: "Semestre 3" },
                        { value: "S4", label: "Semestre 4" },
                    ]}
                    required
                />

                <Label htmlFor="enseignantId">Enseignant</Label>
                <Select
                    name="enseignantId"
                    value={enseignantId}
                    onChange={(e) => setEnseignantId(e.target.value)}
                    options={enseignants.map((e) => ({
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

export default EditModule;