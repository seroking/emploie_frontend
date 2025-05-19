import { useState } from "react";

export default function DayColumn({ groupId, day, schedules, onAdd }) {
  const [showModal, setShowModal] = useState(false);

  // Mock data
  const salles = [
    { id: 1, nom: "Salle A" },
    { id: 2, nom: "Salle B" }
  ];
  const modules = [
    { id: 1, nom: "Math" },
    { id: 2, nom: "Physics" }
  ];
  const formateurs = [
    { id: 1, nom: "Mr. Smith" },
    { id: 2, nom: "Ms. Doe" }
  ];

  // Form state (no label)
  const [seanceData, setSeanceData] = useState({
    salle_id: salles[0].id,
    module_id: modules[0].id,
    formateur_id: formateurs[0].id,
  });

  const handleAddClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onAdd(seanceData);
    setShowModal(false);
    setSeanceData({
      salle_id: salles[0].id,
      module_id: modules[0].id,
      formateur_id: formateurs[0].id,
    });
  };

  const isEmpty = schedules.length === 0;

  function getFormateurName(id) {
    const found = formateurs.find(f => f.id === id);
    return found ? found.nom : "";
  }
  function getModuleName(id) {
    const found = modules.find(m => m.id === id);
    return found ? found.nom : "";
  }

  return (
    <>
      <td className="align-top px-1 py-1 border border-gray-200 bg-gradient-to-br from-[#f8f7fd] to-[#f4f6fa] min-w-[110px] transition-shadow">
        {isEmpty ? (
          <div className="flex items-center justify-center min-h-[80px]">
            <button
              onClick={handleAddClick}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/40 transition-all"
              aria-label="Add schedule"
              type="button"
            >
              <span className="text-2xl font-bold text-[#7C5CFC]">+</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 min-h-[80px]">
            {schedules.map(sch => (
              <div
                key={sch.id}
                className="bg-gradient-to-r from-[#f3f0ff] to-[#e0e7ff] rounded-lg px-2 py-2 text-xs text-gray-700 font-medium shadow hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <span className="font-semibold">
                  {getModuleName(sch.module_id)} - {getFormateurName(sch.formateur_id)}
                </span>
              </div>
            ))}
            {schedules.length < 4 && (
              <button
                onClick={handleAddClick}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#7C5CFC]/20 hover:bg-[#7C5CFC]/40 transition-all mx-auto my-auto"
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
          <div className="bg-white rounded-xl shadow-lg p-6 min-w-[320px]">
            <h3 className="text-lg font-semibold mb-4">Add Seance</h3>
            <form onSubmit={handleFormSubmit}>
              <select
                className="w-full mb-3 px-3 py-2 border rounded"
                value={seanceData.salle_id}
                onChange={e => setSeanceData(f => ({ ...f, salle_id: Number(e.target.value) }))}
              >
                {salles.map(s => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
              <select
                className="w-full mb-3 px-3 py-2 border rounded"
                value={seanceData.module_id}
                onChange={e => setSeanceData(f => ({ ...f, module_id: Number(e.target.value) }))}
              >
                {modules.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
              <select
                className="w-full mb-3 px-3 py-2 border rounded"
                value={seanceData.formateur_id}
                onChange={e => setSeanceData(f => ({ ...f, formateur_id: Number(e.target.value) }))}
              >
                {formateurs.map(fm => (
                  <option key={fm.id} value={fm.id}>{fm.nom}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={handleClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded bg-[#7C5CFC] text-white hover:bg-[#5a3ee6]">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}