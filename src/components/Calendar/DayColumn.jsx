// DayColumn.jsx
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import API from "../../services/api";

dayjs.extend(isBetween);

export default function DayColumn({
  groupId,
  day,
  seances,
  onAddSeance,
  onUpdateSeance,
  onDeleteSeance,
  resources,
  currentSemaine,
  isHoliday, // Ce prop contiendra le nom du jour férié ou null
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [filteredFormateurs, setFilteredFormateurs] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [formData, setFormData] = useState({
    salle_id: "",
    module_id: "",
    formateur_id: "",
    semaine_id: currentSemaine?.id || "",
    type: "presentiel",
    heure_debut: "",
    heure_fin: "",
  });

  const [contextMenu, setContextMenu] = useState(null);

  const MAX_SEANCES_PER_DAY = 4;
  const canAddMoreSeances = seances.length < MAX_SEANCES_PER_DAY && !isHoliday;

  useEffect(() => {
    if (currentSemaine) {
      setFormData((prev) => ({
        ...prev,
        semaine_id: currentSemaine.id,
      }));
    }
  }, [currentSemaine]);

  const handleAddClick = () => {
    if (!canAddMoreSeances || isHoliday) return; // Ne pas ajouter si c'est un jour férié

    setFormData({
      salle_id: "",
      module_id: "",
      formateur_id: "",
      semaine_id: currentSemaine?.id || "",
      type: "presentiel",
      heure_debut: "08:30",
      heure_fin: "11:00",
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditClick = (seance) => {
    if (isHoliday) return; // Ne pas modifier si c'est un jour férié
    setSelectedSeance(seance);
    setFormData({
      salle_id: seance.salle_id,
      module_id: seance.module_id,
      formateur_id: seance.formateur_id,
      semaine_id: seance.semaine_id,
      type: seance.type,
      heure_debut: seance.heure_debut,
      heure_fin: seance.heure_fin,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteClick = async (seanceId) => {
    if (isHoliday) return; // Ne pas supprimer si c'est un jour férié
    try {
      await onDeleteSeance(seanceId);
    } catch (error) {
      console.error("Error deleting seance:", error);
    }
  };

  const handleDuplicateClick = (seance) => {
    if (isHoliday) return; // Ne pas dupliquer si c'est un jour férié

    let newHeureDebut = seance.heure_debut;
    let newHeureFin = seance.heure_fin;

    if (seance.heure_debut === "08:30:00" && seance.heure_fin === "11:00:00") {
      newHeureDebut = "11:00";
      newHeureFin = "13:30";
    } else if (
      seance.heure_debut === "11:00:00" &&
      seance.heure_fin === "13:30:00"
    ) {
      newHeureDebut = "13:30";
      newHeureFin = "16:00";
    } else if (
      seance.heure_debut === "13:30:00" &&
      seance.heure_fin === "16:00:00"
    ) {
      newHeureDebut = "16:00";
      newHeureFin = "18:30";
    } else {
      console.warn(
        "No specific time rule for duplication. Keeping original times."
      );
    }

    setFormData({
      salle_id: seance.salle_id,
      module_id: seance.module_id,
      formateur_id: seance.formateur_id,
      semaine_id: seance.semaine_id,
      type: seance.type,
      heure_debut: newHeureDebut.slice(0, 5),
      heure_fin: newHeureFin.slice(0, 5),
    });
    setModalMode("add");
    setShowModal(true);
    setContextMenu(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedSeance(null);
    setFormData({
      salle_id: "",
      module_id: "",
      formateur_id: "",
      semaine_id: currentSemaine?.id || "",
      type: "presentiel",
      heure_debut: "",
      heure_fin: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isHoliday) return; // Ne pas soumettre si c'est un jour férié

    try {
      const seanceData = {
        ...formData,
        groupe_id: groupId,
        date_seance: day.format("YYYY-MM-DD"),
      };

      if (modalMode === "add") {
        await onAddSeance(seanceData);
      } else {
        await onUpdateSeance(selectedSeance.id, seanceData);
      }

      setShowModal(false);
      setFormData({
        salle_id: "",
        module_id: "",
        formateur_id: "",
        semaine_id: currentSemaine?.id || "",
        type: "presentiel",
        heure_debut: "",
        heure_fin: "",
      });
    } catch (error) {
      console.error("Error handling seance:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  useEffect(() => {
    const fetchFormateurs = async () => {
      if (!formData.module_id || !groupId) {
        setFilteredFormateurs([]);
        return;
      }

      try {
        const response = await API.get(
          `/formateurs-par-module-et-groupe/${formData.module_id}/${groupId}`
        );
        setFilteredFormateurs(response.data.data || []);
        setFormData((prev) => ({
          ...prev,
          formateur_id:
            response.data.data.length > 0
              ? response.data.data[0].formateur.id
              : "",
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des formateurs:", error);
        setFilteredFormateurs([]);
      }
    };

    fetchFormateurs();
  }, [formData.module_id, groupId]);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await API.get(`/modules-par-groupe/${groupId}`);
        setFilteredModules(response.data.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement des modules:", error);
      }
    };
    fetchModule();
  }, [groupId]);

  const handleContextMenu = (e, seance) => {
    e.preventDefault();
    if (isHoliday) return; // Ne pas afficher le menu contextuel si c'est un jour férié
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      seance: seance,
    });
  };

  const handleClickOutsideContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (contextMenu) {
      document.addEventListener("click", handleClickOutsideContextMenu);
    } else {
      document.removeEventListener("click", handleClickOutsideContextMenu);
    }
    return () => {
      document.removeEventListener("click", handleClickOutsideContextMenu);
    };
  }, [contextMenu]);

  // Déterminer la classe et le titre en fonction de isHoliday
  const tdClassName = `align-top px-1 py-1 border border-gray-200 bg-gradient-to-br from-[#f8f7fd] to-[#f4f6fa] min-w-[110px] transition-shadow
    ${isHoliday ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}`;
  const tdTitle = isHoliday ? `Jour férié: ${isHoliday}` : "";

  return (
    <>
      <td className={tdClassName} title={tdTitle}>
        {isHoliday ? (
          <div className="flex items-center justify-center min-h-[80px] text-lg font-semibold text-gray-700 text-center p-2">
            {isHoliday}
          </div>
        ) : seances.length === 0 ? (
          <div className="flex items-center justify-center min-h-[80px]">
            {canAddMoreSeances && (
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/40 transition-all"
                aria-label="Add schedule"
                type="button"
              >
                <span className="text-2xl font-bold text-[#7C5CFC]">+</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex gap-2 min-h-[80px] p-1">
            {seances.map((seance) => (
              <div
                key={seance.id}
                className={`bg-gradient-to-from-[#f3f0ff] to-[#e0e7ff] w-28 rounded-lg p-2 text-xs text-gray-700 font-medium shadow hover:shadow-md transition-all duration-200 relative group
                  ${
                    isHoliday
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer"
                  }`}
                onClick={() => handleEditClick(seance)}
                onContextMenu={(e) => handleContextMenu(e, seance)}
              >
                <div className="text-xs font-bold text-center">
                  {seance.heure_debut.slice(0, 5)} -
                  {seance.heure_fin.slice(0, 5)}
                </div>
                <div className="text-xs text-black text-center">
                  {seance.formateur?.utilisateur?.nom || "N/A"}
                </div>
                <div className="font-semibold text-indigo-600 text-center">
                  {seance.module?.nom || "N/A"}
                </div>
                <div
                  className={`text-xs text-center ${
                    seance.type === "presentiel"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {seance.type === "presentiel"
                    ? seance.salle?.nom || "N/A"
                    : "Teams"}
                </div>
                {!isHoliday && (
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(seance.id);
                      }}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
            {canAddMoreSeances && (
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/40 transition-all mx-auto mt-1"
                aria-label="Add schedule"
                type="button"
              >
                <span className="text-2xl font-bold text-[#7C5CFC]">+</span>
              </button>
            )}
          </div>
        )}
      </td>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px] max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {modalMode === "add"
                ? "Ajouter une séance"
                : "Modifier la séance"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  name="module_id"
                  value={formData.module_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  disabled={isHoliday}
                >
                  <option value="">Sélectionnez un module</option>
                  {filteredModules.map((m) => (
                    <option key={m.module.id} value={m.module.id}>
                      {m.module.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                {formData.module_id && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Formateur
                    </label>
                    <select
                      name="formateur_id"
                      value={formData.formateur_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                      disabled={isHoliday}
                    >
                      {filteredFormateurs.map((f) => (
                        <option key={f.formateur.id} value={f.formateur.id}>
                          {f.formateur.utilisateur.nom}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  disabled={isHoliday}
                >
                  <option value="presentiel">Présentiel</option>
                  <option value="distanciel">Distanciel</option>
                </select>
              </div>

              {formData.type === "presentiel" && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salle
                  </label>
                  <select
                    name="salle_id"
                    value={formData.salle_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    disabled={isHoliday}
                  >
                    <option value="">Sélectionnez une salle</option>
                    {resources.salles.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nom}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure début
                  </label>
                  <input
                    type="time"
                    name="heure_debut"
                    value={formData.heure_debut}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    disabled={isHoliday}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heure fin
                  </label>
                  <input
                    type="time"
                    name="heure_fin"
                    value={formData.heure_fin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                    disabled={isHoliday}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded cursor-pointer bg-gray-100 hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${
                    isHoliday
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#7C5CFC] hover:bg-[#5a3ee6]"
                  }`}
                  disabled={isHoliday}
                >
                  {modalMode === "add" ? "Ajouter" : "Modifier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg py-1"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isHoliday && (
            <>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  handleDuplicateClick(contextMenu.seance);
                  setContextMenu(null);
                }}
              >
                Dupliquer
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
