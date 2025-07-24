import { saveAs } from "file-saver";
import API from "../services/api";

export default function DownloadPDFButton({
  selectedSecteur,
  secteurNom,
  numero_semaine,
  semaineId,
}) {
  const downloadPDF = async () => {
    try {
      // Construire l'URL avec le secteur et l'ID de semaine
      const url = semaineId
        ? `/export-emploi-du-temps/${selectedSecteur}/${semaineId}`
        : `/export-emploi-du-temps/${selectedSecteur}`;

      const response = await API.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(
        blob,
        `emploi_du_temps_${secteurNom}_semaine_${numero_semaine}.pdf`
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
        background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
        boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
      }}
    >
      Télécharger en PDF
    </button>
  );
}
