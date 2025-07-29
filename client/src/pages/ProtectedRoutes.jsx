import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api"; 

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Usuario sem token")

        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/validate");
        if (response.data.valid) {
          setIsAuthenticated(true);
          console.log("Usuario autenticado")
        } else {
          setIsAuthenticated(false);
            console.log("Usuario Nao autenticado")

        }
      } catch {
        console.log("Usuario Nao autenticado")
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }

    validateToken();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;