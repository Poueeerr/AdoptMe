import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirect, setRedirect] = useState(false); // NOVO

  useEffect(() => {
    async function validateToken() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Usuário sem token");
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/validate");
        if (response.data.valid) {
          setIsAuthenticated(true);
          console.log("Usuário autenticado");
        } else {
          setIsAuthenticated(false);
          console.log("Usuário não autenticado");
        }
      } catch {
        console.log("Erro ao validar");
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

  if (redirect) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to="/auth" replace/>
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
