import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <div className="mt-1">Chargement en cours</div>
    </div>
  );
};

export default Loading;
