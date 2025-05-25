import React from "react";
import Button from "./Button";

const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-5 text-left text-sm font-semibold text-gray-700 border-b"
              >
                {col.label}
              </th>
            ))}
            <th className="py-3 px-5 text-sm font-semibold text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-5 border-b text-sm">
                  {row[col.key]}
                </td>
              ))}
              <td className="flex py-3 px-5 border-b text-sm space-x-2">
                <Button
                  className="bg-yellow-500 hover:opacity-90 px-4 py-2 w-auto"
                  onClick={() => onEdit(row)}
                >
                  Edit
                </Button>
                <Button
                  className="bg-red-500 hover:opacity-90 px-4 py-2 w-auto"
                  onClick={() => onDelete(row)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
