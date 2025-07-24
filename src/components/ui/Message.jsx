import React from "react";
import Swal from "sweetalert2";

const Message = ({ type = "info", text, onConfirm }) => {
  React.useEffect(() => {
    if (text) {
      Swal.fire({
        text: text,
        icon: type,
        position: "top",
        showConfirmButton: true,
        confirmButtonText: "OK",
        timer: undefined,
        timerProgressBar: false,
      }).then((result) => {
        if (result.isConfirmed && typeof onConfirm === "function") {
          onConfirm();
        }
      });
    }
  }, [text, type, onConfirm]);

  return null;
};

export default Message;
