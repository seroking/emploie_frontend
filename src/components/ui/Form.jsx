import React from "react";

const Form = ({ children, onSubmit, className = "" }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-auto ${className}`}
    >
      {children}
    </form>
  );
};

export default Form;
