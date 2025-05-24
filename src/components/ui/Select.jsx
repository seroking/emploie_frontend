import React from "react";

const Select = ({
  name,
  options,
  value,
  onChange,
  className = "",
  ...props
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${className}`}
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
