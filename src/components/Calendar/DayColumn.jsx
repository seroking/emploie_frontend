import { useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export default function DayColumn({
  groupId,
  day,
  seances,
  onAddSeance,
  onUpdateSeance,
  onDeleteSeance,
  resources,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [formData, setFormData] = useState({
    salle_id: "",
    module_id: "",
    formateur_id: "",
    semaine_id: resources.semaines[0]?.id || "",
    type: "presentiel",
    heure_debut: "",
    heure_fin: "",
  });

  const MAX_SEANCES_PER_DAY = 4;
  const canAddMoreSeances = seances.length < MAX_SEANCES_PER_DAY;

  const handleAddClick = () => {
    if (!canAddMoreSeances) return;

    setFormData({
      ...formData,
      heure_debut: "08:30",
      heure_fin: "10:50",
    });
    setModalMode("add");
    setShowModal(true);
  };

  const handleEditClick = (seance) => {
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
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette séance ?")) {
      try {
        await onDeleteSeance(seanceId);
      } catch (error) {
        console.error("Error deleting seance:", error);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedSeance(null);
    setFormData({
      salle_id: "",
      module_id: "",
      formateur_id: "",
      semaine_id: resources.semaines[0]?.id || "",
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
    try {
      const seanceData = {
        ...formData,
        groupe_id: groupId,
        date_seance: day.format("YYYY-MM-DD"), // Utilisez directement day qui est déjà un objet dayjs
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
        semaine_id: resources.semaines[0]?.id || "",
        type: "presentiel",
        heure_debut: "",
        heure_fin: "",
      });
    } catch (error) {
      setFormData({
        salle_id: "",
        module_id: "",
        formateur_id: "",
        semaine_id: resources.semaines[0]?.id || "",
        type: "presentiel",
        heure_debut: "",
        heure_fin: "",
      });
      console.error("Error handling seance:", error);
      // Ajoutez ceci pour voir l'erreur en détail
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      }
    }
  };

  const getResourceName = (type, id) => {
    const resource = resources[type]?.find((item) => item.id === id);
    if (!resource) return "N/A";

    switch (type) {
      case "formateurs":
        return resource.utilisateur?.nom || "N/A";
      case "semaines":
        return `Semaine ${resource.numero_semaine}`;
      default:
        return resource.nom || "N/A";
    }
  };

  return (
    <>
      <td className="align-top px-1 py-1 border border-gray-200 bg-gradient-to-br from-[#f8f7fd] to-[#f4f6fa] min-w-[110px] transition-shadow">
        {seances.length === 0 ? (
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
                className="bg-gradient-to- cursor-pointer from-[#f3f0ff] to-[#e0e7ff] w-28 rounded-lg p-2 text-xs text-gray-700 font-medium shadow hover:shadow-md transition-all duration-200 relative group"
                onClick={() => handleEditClick(seance)}
              >
                <div className="text-xs font-bold text-center">
                  {seance.heure_debut.slice(0, 5)} -{" "}
                  {seance.heure_fin.slice(0, 5)}
                </div>
                <div className="text-xs text-black text-center">
                  {getResourceName("formateurs", seance.formateur_id)}
                </div>
                <div className="font-semibold text-indigo-600 text-center">
                  {getResourceName("modules", seance.module_id)}
                </div>
                <div
                  className={`text-xs text-center ${
                    seance.type === "presentiel"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {seance.type === "presentiel"
                    ? getResourceName("salles", seance.salle_id)
                    : "Distanciel"}
                </div>{" "}
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
                >
                  <option value="">Sélectionnez un module</option>
                  {resources.modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formateur
                </label>
                <select
                  name="formateur_id"
                  value={formData.formateur_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Sélectionnez un formateur</option>
                  {resources.formateurs.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.utilisateur?.nom}
                    </option>
                  ))}
                </select>
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
                  className="px-4 py-2 rounded cursor-pointer bg-[#7C5CFC] text-white hover:bg-[#5a3ee6]"
                >
                  {modalMode === "add" ? "Ajouter" : "Modifier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
