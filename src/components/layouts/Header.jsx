// src/components/layout/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../../assets/images/betterLogo.jpeg";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-4 cursor-pointer"
      >
        <img
          src={image}
          alt="Logo OFPPT"
          className="h-10 w-auto object-contain"
        />
        <h1 className="text-xl font-bold text-black">
          OFPPT - Emploi du temps
        </h1>
      </div>

      <button
        onClick={() => navigate("/login")}
        className="px-6 py-3 cursor-pointer rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        style={{
          background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
          boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
        }}
      >
        Se connecter
      </button>
    </header>
  );
};

export default Header;
