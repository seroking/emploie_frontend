import { saveAs } from "file-saver";
import API from "../../services/api";
export default function DownloadFormateurPdfButton({ semaineId, numero_semaine }) {
  const downloadPDF = async () => {
    try {
      const response = await API.get("/formateur/export-emploi-du-temps", {
        responseType: "blob",
        params: { semaine_id: semaineId },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `emploi_du_temps_formateur_semaine_${numero_semaine}.pdf`);
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
        background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
        boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
      }}
    >
      Télécharger PDF
    </button>
  );
}
