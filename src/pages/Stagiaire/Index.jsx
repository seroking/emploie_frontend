import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Form from "../../components/ui/Form";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import Loading from "../../components/ui/Loading";

const IndexStagiaire = () => {
  const [directionRegionales, setDirectionRegionales] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [etablissements, setEtablissement] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [seances, setSeances] = useState([]);

  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedComplexe, setSelectedComplexe] = useState("");
  const [selectedEtablissement, setSelectedEtablissement] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedGroupe, setSelectedGroupe] = useState("");

  const [filteredComplexes, setFiltredComplexes] = useState([]);
  const [filteredEtablissements, setFiltredEtablissements] = useState([]);
  const [filteredFilieres, setFiltredFilieres] = useState([]);
  const [filteredGroupe, setFiltredGroupe] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          directionResponse,
          complexeResponse,
          etablissementResponse,
          groupeResponse,
        ] = await Promise.all([
          API.get("/getDirectionRegionale"),
          API.get("/getComplexe"),
          API.get("/getEtablissement"),
          API.get("/getGroupe"),
        ]);

        setDirectionRegionales(directionResponse.data.data);
        setComplexes(complexeResponse.data.data);
        setEtablissement(etablissementResponse.data.data);
        setGroupes(groupeResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDirection) {
      setFiltredComplexes(
        complexes.filter(
          (complexe) =>
            complexe.direction_regional_id === Number(selectedDirection)
        )
      );
    } else {
      setFiltredComplexes([]);
    }
  }, [selectedDirection, complexes]);

  useEffect(() => {
    if (selectedComplexe) {
      setFiltredEtablissements(
        etablissements.filter(
          (etab) => etab.complexe_id === Number(selectedComplexe)
        )
      );
    } else {
      setFiltredEtablissements([]);
    }
  }, [selectedComplexe, etablissements]);

  useEffect(() => {
    const fetchSecteurs = async () => {
      if (!selectedEtablissement) return;
      try {
        const secteurResponse = await API.get(
          `/getSecteurParEtablissement/${selectedEtablissement}`
        );
        setSecteurs(secteurResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSecteurs();
  }, [selectedEtablissement]);

  useEffect(() => {
    const fetchFilieres = async () => {
      if (!selectedEtablissement) return;
      try {
        const filiereResponse = await API.get(
          `getFiliere/${selectedEtablissement}`
        );
        setFilieres(filiereResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFilieres();
  }, [selectedEtablissement]);

  useEffect(() => {
    if (selectedSecteur) {
      setFiltredFilieres(
        filieres.filter(
          (fil) => fil.filiere.secteur_id === Number(selectedSecteur)
        )
      );
    } else {
      setFiltredFilieres([]);
    }
  }, [selectedSecteur, filieres]);

  useEffect(() => {
    if (selectedFiliere) {
      setFiltredGroupe(
        groupes.filter((gr) => gr.filiere_id === Number(selectedFiliere))
      );
    } else {
      setFiltredGroupe([]);
    }
  }, [selectedFiliere, groupes]);

  useEffect(() => {
    const fetchSeances = async () => {
      if (selectedGroupe && selectedEtablissement) {
        try {
          const seanceResponse = await API.get(
            `getSeance/${selectedEtablissement}/${selectedGroupe}`
          );
          setSeances(seanceResponse.data.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setSeances([]);
      }
    };
    fetchSeances();
  }, [selectedGroupe, selectedEtablissement]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    navigate("/espace-stagiaires/emploi-du-temps", {
      state: { seances },
    });
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <>
      <Header />
      <Form title="Choisissez votre groupe" onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Direction régionale */}
          <h3 className="font-semibold text-gray-700">Direction régionale</h3>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            className="w-full cursor-pointer p-2 border rounded"
          >
            <option value="">
              -- Sélectionnez votre direction régionale --
            </option>
            {directionRegionales.map((dr) => (
              <option key={dr.id} value={dr.id}>
                {dr.nom}
              </option>
            ))}
          </select>

          {/* Complexe */}
          {filteredComplexes.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700">Complexe</h3>
              <select
                value={selectedComplexe}
                onChange={(e) => setSelectedComplexe(e.target.value)}
                className="w-full cursor-pointer p-2 border rounded"
              >
                <option value="">-- Sélectionnez votre complexe --</option>
                {filteredComplexes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Établissement */}
          {filteredEtablissements.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700">Établissement</h3>
              <select
                value={selectedEtablissement}
                onChange={(e) => setSelectedEtablissement(e.target.value)}
                className="w-full cursor-pointer p-2 border rounded"
              >
                <option value="">-- Sélectionnez votre établissement --</option>
                {filteredEtablissements.map((etab) => (
                  <option key={etab.id} value={etab.id}>
                    {etab.nom}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Secteur */}
          {secteurs.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700">Secteur</h3>
              <select
                value={selectedSecteur}
                onChange={(e) => setSelectedSecteur(e.target.value)}
                className="w-full p-2 cursor-pointer border rounded"
              >
                <option value="">-- Sélectionnez votre secteur --</option>
                {secteurs.map((sect) => (
                  <option key={sect.secteur.id} value={sect.secteur.id}>
                    {sect.secteur.nom}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Filière */}
          {filteredFilieres.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700">Filière</h3>
              <select
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                className="w-full p-2 cursor-pointer border rounded"
              >
                <option value="">-- Sélectionnez votre filière --</option>
                {filteredFilieres.map((fil) => (
                  <option key={fil.filiere.id} value={fil.filiere.id}>
                    {fil.filiere.nom}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Groupe */}
          {filteredGroupe.length > 0 && (
            <>
              <h3 className="font-semibold text-gray-700">Groupe</h3>
              <select
                value={selectedGroupe}
                onChange={(e) => setSelectedGroupe(e.target.value)}
                className="w-full cursor-pointer p-2 border rounded"
              >
                <option value="">-- Sélectionnez votre groupe --</option>
                {filteredGroupe.map((gr) => (
                  <option key={gr.id} value={gr.id}>
                    {gr.nom}
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedGroupe && (
            <>
              <button
                type="submit"
                className="bg-blue-600 cursor-pointer text-white w-full px-4 py-2 rounded hover:bg-blue-700"
              >
                Valider
              </button>
            </>
          )}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm cursor-pointer text-blue-600 hover:underline"
          >
            ← Retour
          </button>
        </div>
      </Form>
      <Footer />
    </>
  );
};

export default IndexStagiaire;
