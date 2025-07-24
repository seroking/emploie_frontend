import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ onClick, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); 
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-4 my-2 mr-2 cursor-pointer rounded-xl bg-gradient-to-r from-indigo-600 to-purple-400 text-white font-semibold shadow-md hover:opacity-90 transition ${className}`}
    >
      <FiArrowLeft className="mx-2" />
    </button>
  );
};

export default BackButton;
