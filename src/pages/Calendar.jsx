import { useEffect, useState } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import WeekNavigation from "../components/Calendar/WeekNavigation";
import DayColumn from "../components/Calendar/DayColumn";
import API from "../services/api";
import Message from "../components/ui/Message";
import HideMessage from "../components/ui/hideMessage";
import DownloadPDFButton from "../components/DownloadPDFButton";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [groups, setGroups] = useState([]);
  const [seances, setSeances] = useState([]);
  const [message, setMessage] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [resources, setResources] = useState({
    salles: [],
    modules: [],
    formateurs: [],
    semaines: [],
  });

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

        // Si c'est une erreur d'horaire, on ajoute les créneaux valides
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
          error.response?.data?.message ||
          "Erreur lors de la suppression de la séance.",
      });
    }
  };

  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = currentWeek.startOf("week").add(1, "day");
    for (let i = 0; i < 6; i++) {
      days.push(startOfWeek.add(i, "day"));
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  const fetchSeances = async () => {
    try {
      const response = await API.get("/seances");
      setSeances(response.data.data);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de chargement des séances.",
      });
    }
  };

  const handleAddSeance = async (seanceData) => {
    try {
      await API.post("/seances", seanceData);
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

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [sallesRes, modulesRes, formateursRes, semainesRes] =
          await Promise.all([
            API.get("/salles"),
            API.get("/modules"),
            API.get("/formateurs"),
            API.get("/seances"),
          ]);

        setResources({
          salles: sallesRes.data.salles || [],
          modules: modulesRes.data.data || [],
          formateurs: formateursRes.data.data || [],
          semaines: semainesRes.data.semaine || [],
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Erreur de chargement des ressources.",
        });
      }
    };

    fetchResources();
    fetchSeances();
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
        <HideMessage message={message} onHide={() => setMessage(null)} />
        <div className="px-8 pt-8">
        {selectedSecteur && <DownloadPDFButton selectedSecteur={selectedSecteur} />}
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
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
        </div>
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
                    {day.format("ddd D/MM")}
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
                        resources={resources}
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
      </div>
    </div>
  );
}
