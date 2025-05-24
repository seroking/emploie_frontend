import React from "react";
import clsx from "clsx";

const Message = ({ type = "info", text }) => {
  return (
    <div
      className={clsx("px-4 py-3 rounded shadow-md mb-4", {
        "bg-green-100 text-green-800 border border-green-400":
          type === "success",
        "bg-red-100 text-red-800 border border-red-400": type === "error",
        "bg-blue-100 text-blue-800 border border-blue-400": type === "info",
      })}
    >
      {text}
    </div>
  );
};

export default Message;
