import React from "react";

const Form = ({ title = "", children, onSubmit, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {title && (
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {title}
        </h1>
      )}
      <form
        onSubmit={onSubmit}
        className={`bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl ${className}`}
      >
        {children}
      </form>
    </div>
  );
};

export default Form;
