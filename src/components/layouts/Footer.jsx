// src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="text-center text-gray-600 py-4 border-t bg-white">
      © {new Date().getFullYear()} OFPPT - Tous droits réservés.
    </footer>
  );
};

export default Footer;
