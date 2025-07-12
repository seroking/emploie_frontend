// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bienvenue dans la plateforme d'emploi du temps
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Office de la Formation Professionnelle et de la Promotion du Travail
          (OFPPT)
        </p>

        <button
          onClick={() => navigate("/espace-stagiaires")}
          className="px-6 py-3 cursor-pointer rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          style={{
            background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
            boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
          }}
        >
          Consulter votre emploi du temps
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
