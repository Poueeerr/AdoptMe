import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const clearSession = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      setHasName(false);
      setName("");
    };

    const check = async () => {
      try {
        const response = await api.get("/validate");
        const isValid = response.data.valid === true;
        const storedName = localStorage.getItem("name");

        if (isValid && storedName) {
          setName(storedName);
          setHasName(true);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      }
    };

    check();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setHasName(false);
    setName("");
    setIsMobileMenuOpen(false);
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-blue-800 text-white"
        : "text-white hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <nav className="bg-blue-900">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <img className="h-8 w-auto" src="/public/bone.png" alt="Logo" />

            <div className="hidden sm:flex space-x-6 ml-6">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/adotar" className={linkClass}>
                Adotar
              </NavLink>
              <NavLink to="/divulgar" className={linkClass}>
                Divulgar Adoção
              </NavLink>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            {hasName ? (
              <>
                <span className="text-white text-sm">
                  Bem-vindo(a), <strong>{name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/auth" className={linkClass}>
                Entre ou Cadastre-se
              </NavLink>
            )}
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-blue-900 px-4 pb-4 py-4 space-y-2">
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/adotar"
            className={linkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Adotar
          </NavLink>
          <NavLink
            to="/divulgar"
            className={linkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Divulgar Adoção
          </NavLink>
          {hasName ? (
            <>
              <span className="text-white text-right text-sm block">
                Bem-vindo(a), <strong>{name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium w-full text-right cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={linkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Entre ou Cadastre-se
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
