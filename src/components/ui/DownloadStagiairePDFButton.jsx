import { saveAs } from "file-saver";
import API from "../../services/api";

export default function DownloadStagiairePdfButton({
  groupeId,
  etablissementId,
  nomGroupe,
  numero_semaine,
}) {
  const downloadPDF = async () => {
    try {
      const response = await API.get("/stagiaire/export-emploi-du-temps", {
        responseType: "blob",
        params: { groupe_id: groupeId, etablissement_id: etablissementId },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(
        blob,
        `emploi_du_temps_${nomGroupe}_semaine_${numero_semaine}.pdf`
      );
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF :", error);
      alert("Impossible de télécharger le PDF.");
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="px-6 py-3 cursor-pointer rounded-lg mb-4 text-white float-end font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: "linear-gradient(to right, #2C3E50 0%, #3498DB 100%)",
        boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
      }}
    >
      Télécharger PDF
    </button>
  );
}
