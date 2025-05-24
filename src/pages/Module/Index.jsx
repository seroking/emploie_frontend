import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import Message from "../../components/ui/Message";

const IndexModule = () => {
    const [modules, setModules] = useState([
        {
            id: 1,
            nom: "Mathématiques",
            code: "MATH101",
            semestre: "S1",
            responsable: "Dr. Dupont",
        },
        {
            id: 2,
            nom: "Physique",
            code: "PHY102",
            semestre: "S2",
            responsable: "Mme. Martin",
        },
    ]);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleDelete = (item) => {
        setModules((prev) => prev.filter((m) => m.id !== item.id));
        setMessage({ type: "success", text: "Module supprimé." });
    };

    const handleEdit = (item) => {
        navigate(`/modules/edit/${item.id}`);
    };

    const columns = [
        { key: "nom", label: "Nom" },
        { key: "code", label: "Code" },
        { key: "semestre", label: "Semestre" },
        { key: "responsable", label: "Responsable" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Liste des modules</h1>
                <button
                    onClick={() => navigate("/modules/create")}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition"
                >
                    + Ajouter un module
                </button>
            </div>
            {message && <Message type={message.type} text={message.text} />}
            <Table
                columns={columns}
                data={modules}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default IndexModule;