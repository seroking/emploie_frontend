import React, { useEffect, useState } from "react";
import API from "../services/api";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import WeekNavigationFormateur from "./Calendar/weekNavigationFormateur";
import Loading from "../components/ui/Loading";
import DownloadFormateurPdfButton from "./ui/DownloadFormateurPdfButton";
const Timetable = () => {
  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const creneaux = [
    "08:30 - 11:00",
    "11:00 - 13:30",
    "13:30 - 16:00",
    "16:00 - 18:30",
  ];

  const [seances, setSeances] = useState([]);
  const [semaine, setSemaine] = useState(null);
  const [semainesList, setSemainesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeekId, setCurrentWeekId] = useState(null);
  const [nomEtablissement, setNomEtablissement] = useState("");

  dayjs.extend(weekday);
  dayjs.extend(weekOfYear);

  // Charger la liste des semaines disponibles
  useEffect(() => {
    const fetchSemaines = async () => {
      try {
        const response = await API.get("/semaines");
        setSemainesList(response.data.data);
        setNomEtablissement(
          response.data.data[0]?.etablissement?.nom || "Etablissement non spécifié"
        );

        // Trouver la semaine courante (la plus récente)
        if (response.data.data.length > 0) {
          const currentWeek = response.data.data[0];
          setCurrentWeekId(currentWeek.id);
          fetchSeances(currentWeek.id);
        }
      } catch (err) {
        console.error("Erreur de chargement des semaines:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSemaines();
  }, []);

  // Charger les séances pour une semaine donnée
  const fetchSeances = async (weekId) => {
    setLoading(true);
    try {
      const response = await API.get(`/mes-seances/semaine/${weekId}`);

      if (!response.data.data || !Array.isArray(response.data.data)) {
        throw new Error("Format de données invalide");
      }

      setSeances(response.data.data);
      setSemaine(response.data.semaine);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de chargement:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Navigation entre les semaines
  const handleWeekChange = (direction) => {
    const currentIndex = semainesList.findIndex((w) => w.id === currentWeekId);
    if (currentIndex === -1) return;

    if (direction === "prev" && currentIndex < semainesList.length - 1) {
      const prevWeek = semainesList[currentIndex + 1];
      setCurrentWeekId(prevWeek.id);
      fetchSeances(prevWeek.id);
    } else if (direction === "next" && currentIndex > 0) {
      const nextWeek = semainesList[currentIndex - 1];
      setCurrentWeekId(nextWeek.id);
      fetchSeances(nextWeek.id);
    }
  };

  const getJourFromDate = (dateString) => {
    try {
      if (!dateString) return -1;

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error("Date invalide:", dateString);
        return -1;
      }

      const day = date.getDay(); // 0 (dimanche) à 6 (samedi)
      // Ajustement pour avoir lundi=0 à samedi=5
      return day === 0 ? 6 : day - 1;
    } catch (err) {
      console.error("Erreur dans getJourFromDate:", err);
      return -1;
    }
  };

  const getCreneauIndex = (heureDebut, heureFin) => {
    if (!heureDebut || !heureFin) return -1;

    // Normaliser les formats d'heure
    const formatTime = (time) => {
      return time.slice(0, 5); // Garde seulement "HH:MM"
    };

    const creneauxMap = creneaux.map((creneau) => {
      const [debut, fin] = creneau.split(" - ");
      return { debut, fin };
    });

    const heureDebutNorm = formatTime(heureDebut);
    const heureFinNorm = formatTime(heureFin);

    for (let i = 0; i < creneauxMap.length; i++) {
      if (
        heureDebutNorm === creneauxMap[i].debut &&
        heureFinNorm === creneauxMap[i].fin
      ) {
        return i;
      }
    }

    console.warn(`Aucun créneau trouvé pour ${heureDebut} - ${heureFin}`);
    return -1;
  };

  // Organiser les séances par jour et créneau
  const organizedSeances = Array(jours.length)
    .fill()
    .map(() => Array(creneaux.length).fill(null));

  seances.forEach((seance) => {
    const jourIndex = getJourFromDate(seance.date_seance);
    const creneauIndex = getCreneauIndex(seance.heure_debut, seance.heure_fin);

    if (jourIndex >= 0 && jourIndex < jours.length && creneauIndex >= 0) {
      // Gérer les cas où plusieurs séances peuvent avoir le même créneau
      if (organizedSeances[jourIndex][creneauIndex]) {
        if (!Array.isArray(organizedSeances[jourIndex][creneauIndex])) {
          organizedSeances[jourIndex][creneauIndex] = [
            organizedSeances[jourIndex][creneauIndex],
          ];
        }
        organizedSeances[jourIndex][creneauIndex].push(seance);
      } else {
        organizedSeances[jourIndex][creneauIndex] = seance;
      }
    } else {
      console.warn("Séance non placée:", seance);
    }
  });

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erreur:</strong> {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <WeekNavigationFormateur
        onPrev={() => handleWeekChange("prev")}
        onNext={() => handleWeekChange("next")}
        canGoPrev={
          currentWeekId &&
          semainesList.findIndex((w) => w.id === currentWeekId) <
            semainesList.length - 1
        }
        canGoNext={
          currentWeekId &&
          semainesList.findIndex((w) => w.id === currentWeekId) > 0
        }
      />
      <div>
        {semaine && (
          <div className="mb-6 bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-blue-800">
                Emploi du temps - Semaine {semaine.numero_semaine} du{" "}
                {new Date(semaine.date_debut).toLocaleDateString()} au{" "}
                {new Date(semaine.date_fin).toLocaleDateString()}
              </h2>
              <p className="text-blue-600">
                Année scolaire: {semaine.annee_scolaire?.nom || "Non spécifiée"}
              </p>
              <p className="text-blue-600">
                Etablissement : {nomEtablissement}
              </p>
            </div>
            {seances.length > 0 && (
              <>
                <DownloadFormateurPdfButton
                  semaineId={semaine?.id}
                  numero_semaine={semaine.numero_semaine}
                />
              </>
            )}
          </div>
        )}

        {seances.length === 0 ? (
          <div className="text-center text-gray-500">
            Aucune séance prévue pour cette semaine.
          </div>
        ) : (
          <>
            <table className="table-auto border-collapse w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 w-32 py-3 px-4 text-left">
                    Jour/Créneau
                  </th>
                  {creneaux.map((creneau, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 py-3 px-4 text-sm font-medium text-gray-700"
                    >
                      {creneau}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jours.map((jour, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border border-gray-300 py-3 px-4 font-medium text-gray-800">
                      {jour}
                    </td>
                    {creneaux.map((_, colIndex) => {
                      const seanceOrSeances =
                        organizedSeances[rowIndex][colIndex];
                      return (
                        <td
                          key={colIndex}
                          className="border border-gray-300 min-h-[4rem] p-1 hover:bg-gray-100 transition-colors"
                        >
                          {seanceOrSeances ? (
                            Array.isArray(seanceOrSeances) ? (
                              seanceOrSeances.map((seance, i) => (
                                <SeanceCard key={i} seance={seance} />
                              ))
                            ) : (
                              <SeanceCard seance={seanceOrSeances} />
                            )
                          ) : (
                            <div className="h-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">-</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

// Composant pour afficher une séance
const SeanceCard = ({ seance }) => {
  return (
    <div className="h-full flex flex-col justify-center p-2 last:mb-0 border-b last:border-b-0 border-gray-200">
      <div className="font-medium text-center text-sm">
        {seance.groupe?.nom || "Groupe inconnu"}
      </div>
      <div className="text-sm font-semibold text-center text-purple-700">
        {seance.module?.nom || "Module inconnu"}
      </div>
      {seance.type?.toLowerCase() === "distanciel" ? (
        <div className="text-xs text-center text-red-600 bg-red-50 px-1 rounded">
          Teams
        </div>
      ) : (
        <div className="text-xs text-center text-green-700 bg-green-50 px-1 rounded">
          {seance.salle?.nom || "Salle non spécifiée"}
        </div>
      )}
    </div>
  );
};

export default Timetable;
