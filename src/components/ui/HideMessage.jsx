// src/components/ui/HideMessage.jsx
import { useEffect } from "react";

const HideMessage = ({ message, onHide, delay = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onHide(), delay);
      return () => clearTimeout(timer);
    }
  }, [message, onHide, delay]);

  return null;
};

export default HideMessage;
