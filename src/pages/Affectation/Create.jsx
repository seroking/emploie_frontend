import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import BackButton from "../../components/ui/BackButton";

const CreateAffectation = () => {
  const [formateurId, setFormateurId] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [groupeId, setGroupeId] = useState(null);
  const [formateurs, setFormateurs] = useState([]);
  const [modules, setModules] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [message, setMessage] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [secteurId, setSecteurId] = useState(null);
  const [filiereId, setFiliereId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const res = await API.get("/getSecteurs");
        setSecteurs(res.data.data || []);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des secteurs.",
        });
      }
    };

    fetchSecteurs();
  }, []);

  // Charger les filières en fonction du secteur sélectionné
  useEffect(() => {
    const fetchFilieres = async () => {
      if (secteurId) {
        try {
          const res = await API.get(`/getFilieresBySecteur/${secteurId}`);
          setFilieres(res.data.data || []);
        } catch (err) {
          setMessage({
            type: "error",
            text: "Erreur de chargement des filières.",
          });
        }
      } else {
        setFilieres([]);
      }
    };

    fetchFilieres();
  }, [secteurId]);

  // charger les modules et les groupes en fonction de la filière sélectionnée
  useEffect(() => {
    const fetchModulesAndGroupes = async () => {
      if (filiereId) {
        try {
          const res = await API.get(
            `/getModulesAndGroupesByFiliere/${filiereId}`
          );
          setModules(res.data.modules || []);
          setGroupes(res.data.groupes || []);
        } catch (err) {
          setMessage({
            type: "error",
            text: "Erreur de chargement des modules et groupes.",
          });
        }
      } else {
        setModules([]);
        setGroupes([]);
      }
    };

    fetchModulesAndGroupes();
  }, [filiereId]);

  // Charger les options depuis le backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/affectations"); // Contient formateurs, modules, groupes
        setFormateurs(res.data.formateurs || []);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des données.",
        });
      }
    };

    fetchData();
  }, []);

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/affectations", {
        formateur_id: formateurId,
        module_id: moduleId,
        groupe_id: groupeId,
      });

      setMessage({ type: "success", text: "Affectation créée avec succès." });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la création.",
      });
    }
  };

  return (
    <>
      {message && (
        <Message
          type={message.type}
          text={message.text}
          onConfirm={
            message.type === "success" ? () => navigate(-1) : undefined
          }
        />
      )}
      {!filiereId && (
        <Form title="Choisissez une filière">
          <Label htmlFor="secteur">Secteur</Label>
          <Select
            name="secteur"
            value={secteurId}
            onChange={(e) => setSecteurId(e.target.value)}
            options={secteurs.map((s) => ({
              value: s.secteur.id,
              label: s.secteur.nom,
            }))}
            required
          />
          {secteurId && (
            <>
              <Label htmlFor="filiere">Filière</Label>
              <Select
                name="filiere"
                value={filiereId}
                onChange={(e) => setFiliereId(e.target.value)}
                options={filieres.map((f) => ({
                  value: f.filiere.id,
                  label: f.filiere.nom,
                }))}
                required
              />
            </>
          )}
        </Form>
      )}

      {filiereId && (
        <>
          <Form onSubmit={handleSubmit} title="Créer une Affectation">
            <Label htmlFor="formateur">Formateur</Label>
            <Select
              name="formateur"
              value={formateurId}
              onChange={(e) => setFormateurId(e.target.value)}
              options={formateurs.map((f) => ({
                value: f.id,
                label: f.utilisateur?.nom || "Non défini",
              }))}
              required
            />

            <Label htmlFor="module">Module</Label>
            <Select
              name="module"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              options={modules.map((m) => ({
                value: m.id,
                label: m.nom,
              }))}
              required
            />

            <Label htmlFor="groupe">Groupe</Label>
            <Select
              name="groupe"
              value={groupeId}
              onChange={(e) => setGroupeId(e.target.value)}
              options={groupes.map((g) => ({
                value: g.id,
                label: g.nom,
              }))}
              required
            />

            <div className="flex">
              <BackButton />
              <Button type="submit">Créer</Button>
            </div>
          </Form>
        </>
      )}
    </>
  );
};

export default CreateAffectation;
