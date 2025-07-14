import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DownloadStagiairePdfButton from "./DownloadStagiairePDFButton";

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const creneaux = [
  "08:30 - 10:50",
  "11:10 - 13:30",
  "13:30 - 15:50",
  "16:10 - 18:30",
];

const TimeTableStagiaire = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const seances = state?.seances || [];
  const groupe = seances[0]?.groupe || null;

  const groupeNom = seances[0]?.groupe?.nom ?? "Inconnu";
  const semaine = seances[0]?.semaine;
  const numeroSemaine = semaine?.numero_semaine ?? "N/A";
  const dateDebut = semaine?.date_debut
    ? new Date(semaine.date_debut).toLocaleDateString()
    : "N/A";
  const dateFin = semaine?.date_fin
    ? new Date(semaine.date_fin).toLocaleDateString()
    : "N/A";

  const getJourFromDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const getCreneauIndex = (heureDebut, heureFin) => {
    const format = (t) => t.slice(0, 5);
    const debutNorm = format(heureDebut);
    const finNorm = format(heureFin);
    for (let i = 0; i < creneaux.length; i++) {
      const [debut, fin] = creneaux[i].split(" - ");
      if (debut === debutNorm && fin === finNorm) return i;
    }
    return -1;
  };

  const organizedSeances = Array(jours.length)
    .fill()
    .map(() => Array(creneaux.length).fill(null));

  seances.forEach((seance) => {
    const jourIndex = getJourFromDate(seance.date_seance);
    const creneauIndex = getCreneauIndex(seance.heure_debut, seance.heure_fin);

    if (jourIndex >= 0 && jourIndex < jours.length && creneauIndex >= 0) {
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
    }
  });

  return (
    <div className="p-8 min-h-[60vh] flex flex-col items-center justify-center text-center">
      {seances.length === 0 ? (
        <>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            L'emploi du temps de la semaine prochaine n'a pas encore été créé.
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
          >
            ← Retour
          </button>
        </>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">
                Emploi du temps du groupe {groupeNom}
              </h2>
              <p className="text-gray-600">
                Semaine {numeroSemaine} : du {dateDebut} au {dateFin}
              </p>
            </div>
            {groupe && (
              <DownloadStagiairePdfButton
                groupeId={groupe.id}
                etablissementId={groupe.etablissement_id}
                nomGroupe={groupe.nom}
                numero_semaine={numeroSemaine}
              />
            )}
          </div>

          <table className="table-auto border-collapse w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 w-32 py-3 px-4 text-left">
                  Jour / Créneau
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
                    const cell = organizedSeances[rowIndex][colIndex];
                    return (
                      <td
                        key={colIndex}
                        className="border border-gray-300 min-h-[4rem] p-1 hover:bg-gray-100 transition-colors"
                      >
                        {cell ? (
                          Array.isArray(cell) ? (
                            cell.map((seance, i) => (
                              <SeanceCard key={i} seance={seance} />
                            ))
                          ) : (
                            <SeanceCard seance={cell} />
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

          <div className="text-center mt-6">
            <button
              onClick={() => navigate(-1)}
              className="text-sm cursor-pointer text-blue-600 hover:underline"
            >
              ← Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SeanceCard = ({ seance }) => {
  return (
    <div className="h-full flex flex-col justify-center p-2 last:mb-0 border-b last:border-b-0 border-gray-200">
      <div className="font-medium text-center text-sm">
        <div className="text-sm font-semibold text-center text-black-700">
          {seance.formateur.utilisateur.nom || "Module inconnu"}
        </div>
        <div className="text-sm font-semibold text-center text-purple-700">
          {seance.module?.nom || "Module inconnu"}
        </div>
      </div>
      {seance.type === "distanciel" ? (
        <div className="text-xs text-center mt-1.5 text-red-600 bg-red-50 px-1 rounded">
          Distanciel
        </div>
      ) : (
        <div className="text-xs text-center mt-1.5 text-green-700 bg-green-50 px-1 rounded">
          {seance.salle?.nom || "Salle inconnue"}
        </div>
      )}
    </div>
  );
};

export default TimeTableStagiaire;
