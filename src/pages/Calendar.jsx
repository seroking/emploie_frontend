import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import WeekNavigation from "../components/Calendar/WeekNavigation";
import DayColumn from "../components/Calendar/DayColumn";
import API from "../services/api";
import Message from "../components/ui/Message";
import DownloadPDFButton from "../components/DownloadPDFButton";
import Swal from "sweetalert2";
import Loading from "../components/ui/Loading";
import "dayjs/locale/fr";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale("fr");

export default function Calendar() {
  const [currentWeekId, setCurrentWeekId] = useState(null);
  const [currentSemaine, setCurrentSemaine] = useState(null);
  const [semaines, setSemaines] = useState([]);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [groups, setGroups] = useState([]);
  const [seances, setSeances] = useState([]);
  const [message, setMessage] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [isLoadingSeances, setIsLoadingSeances] = useState(false);
  const [annee_scolaire_nom, setAnneeScolaireNom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState({
    salles: [],
    modules: [],
    formateurs: [],
  });

  useEffect(() => {
    const fetchSemaines = async () => {
      try {
        const response = await API.get("/semaines");
        setSemaines(response.data.data || []);
        setAnneeScolaireNom(response.data.annee_scolaire_nom || null);

        // Sélectionner la semaine courante (la première dans la liste)
        if (response.data.data && response.data.data.length > 0) {
          const currentWeek = response.data.data[0];
          setCurrentWeekId(currentWeek.id);
          setCurrentSemaine(currentWeek);
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des semaines.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSemaines();
  }, []);

  const handleWeekNavigation = async (direction) => {
    const currentIndex = semaines.findIndex((s) => s.id === currentWeekId);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "prev" && currentIndex < semaines.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === "next" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return;
    }

    const newSemaine = semaines[newIndex];
    setCurrentWeekId(newSemaine.id);
    setCurrentSemaine(newSemaine);
    setIsLoadingSeances(true);
    await fetchSeances();
    setIsLoadingSeances(false);
  };

  const canGoPrev =
    currentWeekId &&
    semaines.findIndex((s) => s.id === currentWeekId) < semaines.length - 1;
  const canGoNext =
    currentWeekId && semaines.findIndex((s) => s.id === currentWeekId) > 0;

  const fetchSeances = async () => {
    if (!currentWeekId) return;

    try {
      const response = await API.get(`/seances-par-semaine/${currentWeekId}`);
      setSeances(response.data.data || []);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de chargement des séances.",
      });
      setSeances([]);
    }
  };

  useEffect(() => {
    if (currentWeekId) {
      fetchSeances();
    }
  }, [currentWeekId]);

  const handleWeekSelect = async (weekId) => {
    const selectedWeek = semaines.find((s) => s.id === parseInt(weekId));
    if (selectedWeek) {
      setIsLoadingSeances(true);
      setCurrentWeekId(selectedWeek.id);
      setCurrentSemaine(selectedWeek);
      await fetchSeances();
      setIsLoadingSeances(false);
    }
  };

  const handleUpdateSeance = async (seanceId, seanceData) => {
    try {
      const response = await API.put(`/seances/${seanceId}`, seanceData);
      fetchSeances();
      setMessage({
        type: "success",
        text: "Séance modifiée avec succès.",
      });
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = "Erreur lors de la modification de la séance.";

      if (errorData?.message) {
        errorMessage = errorData.message;

        if (errorData.valid_hours) {
          errorMessage += "\nCréneaux valides:";
          errorMessage += `\n- Première séance: ${errorData.valid_hours.premiere_seance.join(
            ", "
          )}`;
          errorMessage += `\n- Deuxième séance: ${errorData.valid_hours.deuxieme_seance.join(
            ", "
          )}`;
        }
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  const handleDeleteSeance = async (seanceId) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr de vouloir supprimer cette séance ?",
      text: "Cette séance sera définitivement supprimée !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/seances/${seanceId}`);
        fetchSeances();
        setMessage({
          type: "success",
          text: "Séance supprimée avec succès.",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message || "Erreur lors de la suppression.",
        });
      }
    }
  };

  const handleAddSeance = async (seanceData) => {
    try {
      const seanceWithWeek = {
        ...seanceData,
        semaine_id: currentWeekId,
      };

      await API.post("/seances", seanceWithWeek);
      fetchSeances();
      setMessage({
        type: "success",
        text: "Séance ajoutée avec succès.",
      });
    } catch (error) {
      const errorData = error.response?.data;
      let errorMessage = "Erreur lors de l'ajout de la séance.";

      if (errorData?.message) {
        errorMessage = errorData.message;

        if (errorData.valid_hours) {
          errorMessage += "\nCréneaux valides:";
          errorMessage += `\n- Première séance: ${errorData.valid_hours.premiere_seance.join(
            ", "
          )}`;
          errorMessage += `\n- Deuxième séance: ${errorData.valid_hours.deuxieme_seance.join(
            ", "
          )}`;
        }
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  const handleDuplicateSeance = async (seanceData) => {
    // For duplication, we essentially perform an 'add' operation with existing data
    // The DayColumn component will call handleAddSeance with the pre-filled form data.
    // So, no extra logic needed here beyond what handleAddSeance already does.
    // The form will open in "add" mode with duplicated data.
    console.log("Duplicating seance:", seanceData);
  };

  const getDaysOfWeek = () => {
    if (!currentSemaine) return [];

    const days = [];
    const startDate = dayjs(currentSemaine.date_debut);

    for (let i = 0; i < 6; i++) {
      days.push(startDate.add(i, "day"));
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [sallesRes, modulesRes] = await Promise.all([
          API.get("/salles"),
          API.get("/modules"),
        ]);

        setResources({
          salles: sallesRes.data.salles || [],
          modules: modulesRes.data.data || [],
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des ressources.",
        });
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const fetchSecteurs = async () => {
      try {
        const response = await API.get("/secteurs-etablissements");
        setSecteurs(response.data.data || []);
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des secteurs.",
        });
      }
    };
    fetchSecteurs();
  }, []);

  useEffect(() => {
    if (!selectedSecteur) return;

    const fetchGroupes = async () => {
      try {
        const response = await API.get(
          `/groupes-par-secteur/${selectedSecteur}`
        );
        setGroups(response.data.data.groupes || []);
        setResources((prev) => ({
          ...prev,
          modules: response.data.data.modules || [],
        }));
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des groupes.",
        });
        setGroups([]);
      }
    };
    fetchGroupes();
  }, [selectedSecteur]);

  const handleSecteurChange = (e) => {
    setSelectedSecteur(e.target.value);
  };

  const getSeancesForGroupAndDay = (groupId, day) => {
    return seances.filter(
      (seance) =>
        seance.groupe_id === groupId &&
        dayjs(seance.date_seance).format("DD-MM") === day.format("DD-MM")
    );
  };

  const formatFrenchDay = (day) => {
    const dayMap = {
      "lun.": "Lun",
      "mar.": "Mar",
      "mer.": "Mer",
      "jeu.": "Jeu",
      "ven.": "Ven",
      "sam.": "Sam",
    };
    const formatted = day.format("ddd");
    return dayMap[formatted] || formatted;
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9e6ff] to-[#f7f8fa] py-12">
      <div className="w-full max-w-5xl bg-white/80 rounded-2xl shadow-xl border border-gray-100">
        {message && (
          <Message
            type={message.type}
            text={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        <div className="px-8 pt-8">
          {selectedSecteur && (
            <>
              {seances.length > 0 && currentSemaine && (
                <DownloadPDFButton
                  selectedSecteur={selectedSecteur}
                  numero_semaine={currentSemaine.numero_semaine}
                  secteurNom={
                    secteurs.find(
                      (s) => s.secteur.id === parseInt(selectedSecteur)
                    )?.secteur.nom
                  }
                  semaineId={currentSemaine.id}
                />
              )}
            </>
          )}

          <select
            onChange={handleSecteurChange}
            value={selectedSecteur || ""}
            className="w-full p-2 border cursor-pointer border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Sélectionnez un secteur --</option>
            {secteurs.map((sect) => (
              <option key={sect.secteur.id} value={sect.secteur.id}>
                {sect.secteur.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="sticky top-0 z-10 bg-white/80 rounded-t-2xl px-8 pt-8 pb-4">
          <WeekNavigation
            onPrev={() => handleWeekNavigation("prev")}
            onNext={() => handleWeekNavigation("next")}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            currentSemaine={currentSemaine}
            annee_scolaire_nom={annee_scolaire_nom}
            semaines={semaines}
            onWeekSelect={handleWeekSelect}
          />
          {isLoadingSeances && <Loading />}
        </div>

        {!isLoadingSeances && (
          <div className="overflow-x-auto px-8 pb-8">
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-xs font-semibold text-gray-500 px-4 py-2 text-left bg-gradient-to-r from-[#edeaff] to-[#f7f8fa] rounded-l-xl">
                    Groupe
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day.format("DD-MM")}
                      className="text-xs font-semibold text-gray-500 px-4 py-2 bg-gradient-to-r from-[#edeaff] to-[#f7f8fa] rounded-xl"
                    >
                      {formatFrenchDay(day)} {day.format("D/MM")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <tr key={group.id} className="align-top">
                      <td className="text-sm font-medium text-gray-700 px-4 py-4 bg-white rounded-l-xl shadow-sm">
                        {group.nom}
                      </td>
                      {weekDays.map((day) => (
                        <DayColumn
                          key={`${group.id}-${day.format("DD-MM")}`}
                          groupId={group.id}
                          day={day}
                          seances={getSeancesForGroupAndDay(group.id, day)}
                          onAddSeance={handleAddSeance}
                          onUpdateSeance={handleUpdateSeance}
                          onDeleteSeance={handleDeleteSeance}
                          onDuplicateSeance={handleDuplicateSeance}
                          resources={resources}
                          currentSemaine={currentSemaine}
                        />
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={weekDays.length + 1}
                      className="text-center py-4 text-gray-500"
                    >
                      {selectedSecteur
                        ? "Aucun groupe trouvé pour ce secteur"
                        : "Veuillez sélectionner un secteur"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
