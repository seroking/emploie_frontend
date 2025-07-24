import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "../../components/ui/Form";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Message from "../../components/ui/Message";
import API from "../../services/api";
import Loading from "../../components/ui/Loading";
import BackButton from "../../components/ui/BackButton";

const EditModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [masseHorairePresentiel, setMasseHorairePresentiel] = useState("");
  const [masseHoraireDistanciel, setMasseHoraireDistanciel] = useState("");
  const [typeEfm, setTypeEfm] = useState("");
  const [semestre, setSemestre] = useState("");
  const [filiereId, setFiliereId] = useState("");
  const [filieres, setFilieres] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filieresRes = await API.get("/modules"); // Fetch filieres
        setFilieres(filieresRes.data.filieres);

        const moduleRes = await API.get(`/modules/${id}`); // Fetch module
        const module = moduleRes.data.data;
        setNom(module.nom);
        setMasseHorairePresentiel(module.masse_horaire_presentiel);
        setMasseHoraireDistanciel(module.masse_horaire_distanciel);
        setTypeEfm(module.type_efm);
        setSemestre(module.semestre);
        setFiliereId(module.filiere_id);
      } catch (err) {
        setMessage({
          type: "error",
          text: "Erreur lors du chargement des données.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/modules/${id}`, {
        nom,
        masse_horaire_presentiel: masseHorairePresentiel,
        masse_horaire_distanciel: masseHoraireDistanciel,
        type_efm: typeEfm,
        semestre,
        filiere_id: filiereId,
      });
      setMessage({ type: "success", text: "Module modifié avec succès." });
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
      <Form onSubmit={handleSubmit} title="Modifier un Module">
        <Label htmlFor="nom">Nom du module</Label>
        <Input
          name="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />

        <Label htmlFor="masseHorairePresentiel">Masse horaire présentiel</Label>
        <Input
          name="masseHorairePresentiel"
          type="number"
          value={masseHorairePresentiel}
          onChange={(e) => setMasseHorairePresentiel(e.target.value)}
          required
        />

        <Label htmlFor="masseHoraireDistanciel">Masse horaire distanciel</Label>
        <Input
          name="masseHoraireDistanciel"
          type="number"
          value={masseHoraireDistanciel}
          onChange={(e) => setMasseHoraireDistanciel(e.target.value)}
          required
        />

        <Label htmlFor="typeEfm">Type EFM</Label>
        <Select
          name="typeEfm"
          value={typeEfm}
          onChange={(e) => setTypeEfm(e.target.value)}
          options={[
            { value: "Regional", label: "Régional" },
            { value: "Local", label: "Local" },
          ]}
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
          ]}
          required
        />

        <Label htmlFor="filiereId">Filière</Label>
        <Select
          name="filiereId"
          value={filiereId}
          onChange={(e) => setFiliereId(e.target.value)}
          options={filieres.map((f) => ({ value: f.id, label: f.nom }))}
          required
        />

        <div className="flex">
          <BackButton />
          <Button type="submit">Modifier</Button>
        </div>
      </Form>
    </>
  );
};

export default EditModule;
