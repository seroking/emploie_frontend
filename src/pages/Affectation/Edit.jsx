import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import BackButton from "../../components/ui/BackButton";

const EditAffectation = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formateurId, setFormateurId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [groupeId, setGroupeId] = useState("");

  const [formateurs, setFormateurs] = useState([]);
  const [modules, setModules] = useState([]);
  const [groupes, setGroupes] = useState([]);

  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [secteurId, setSecteurId] = useState(null);
  const [filiereId, setFiliereId] = useState(null);

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger secteurs au montage
  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const res = await API.get("/getSecteurs");
        setSecteurs(res.data.data || []);
      } catch {
        setMessage({
          type: "error",
          text: "Erreur de chargement des secteurs.",
        });
      }
    };
    fetchSecteurs();
  }, []);

  // Charger données de l’affectation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/affectations/${id}`);
        const affectation = res.data.data;

        setFormateurId(affectation.formateur?.id || "");
        setModuleId(affectation.module?.id || "");
        setGroupeId(affectation.groupe?.id || "");

        // Déterminer la filière et le secteur à partir du module/groupe (ajuster selon ton backend)
        const moduleFiliereId = affectation.module?.filiere?.id;
        const secteurParentId = affectation.module?.filiere?.secteur?.id;

        setFiliereId(moduleFiliereId);
        setSecteurId(secteurParentId);

        // Charger options globales
        const optRes = await API.get("/affectations");
        setFormateurs(optRes.data.formateurs || []);
      } catch {
        setMessage({
          type: "error",
          text: "Erreur de chargement des données.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Charger filières quand secteur change
  useEffect(() => {
    const fetchFilieres = async () => {
      if (secteurId) {
        try {
          const res = await API.get(`/getFilieresBySecteur/${secteurId}`);
          setFilieres(res.data.data || []);
        } catch {
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

  // Charger modules et groupes quand filière change
  useEffect(() => {
    const fetchModulesAndGroupes = async () => {
      if (filiereId) {
        try {
          const res = await API.get(
            `/getModulesAndGroupesByFiliere/${filiereId}`
          );
          setModules(res.data.modules || []);
          setGroupes(res.data.groupes || []);
        } catch {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/affectations/${id}`, {
        formateur_id: formateurId,
        module_id: moduleId,
        groupe_id: groupeId,
      });

      setMessage({
        type: "success",
        text: "Affectation modifiée avec succès.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erreur lors de la modification.",
      });
    }
  };

  if (isLoading) return <Loading />;

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
            onChange={(e) => {
              setSecteurId(e.target.value);
              setFiliereId(null);
            }}
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
        <Form onSubmit={handleSubmit} title="Modifier une Affectation">
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
              <Button type="submit">Modifier</Button>
            </div>
        </Form>
      )}
    </>
  );
};

export default EditAffectation;
