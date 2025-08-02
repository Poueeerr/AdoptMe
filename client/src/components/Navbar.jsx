import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api";

function Navbar() {
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        const response = await api.get('/validate');
        if(response.data.valid === true){  
          const storedName = localStorage.getItem('name');
          if (storedName) {
            setName(storedName);
            setHasName(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('name');
            setHasName(false);
            setName("");
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('name');
          setHasName(false);
          setName("");
        } 
        
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        setHasName(false);
        setName("");
      }
    }
    check();
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setHasName(false);
    setName("");
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? "bg-blue-800 text-white" : "text-white hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <nav className="bg-blue-900">
      <div className="w-full px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between">

          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src=""
              alt="Logo"
            />
            <div className="hidden sm:block ml-6">
              <div className="flex space-x-4">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
              </div>
            </div>
            <div className="hidden sm:block ml-6">
              <div className="flex space-x-4">
                <NavLink to="/adotar" className={linkClass}>
                  Adotar
                </NavLink>
              </div>
            </div>
            <div className="hidden sm:block ml-6">
              <div className="flex space-x-4">
                <NavLink to="/divulgar" className={linkClass}>
                  Divulgar Adoção
                </NavLink>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {hasName ? (
              <>
                <span className="text-white text-sm hidden sm:inline">
                  Bem-vindo(a), <strong>{name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/auth"
                className={linkClass}
              >
                Entre ou Cadastre-se
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
