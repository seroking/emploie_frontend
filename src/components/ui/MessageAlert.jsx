import Swal from "sweetalert2";

const MessageAlert = async (entityName = "cet élément") => {
  const result = await Swal.fire({
    title: `Êtes-vous sûr de vouloir supprimer ${entityName} ?`,
    text: `${entityName} sera définitivement supprimée !`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  return result.isConfirmed;
};

export default MessageAlert;
