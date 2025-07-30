import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api"; 

function Navbar() {
  const [name, setName] = useState("");
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    async function check() {
      try {
        await api.get('/validate');
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

  return (
    <nav className="bg-gray-200 flex h-10 items-center">
      <div className="grow flex justify-start gap-5 px-10">
        <Link to="/" className="">
          Home
        </Link>
      </div>
      <div className="grow flex justify-end gap-5 px-10">
          {hasName ? (
            <>
              <p >
                Bem vindo(a), <span >{name}</span>
              </p>
              <button onClick={handleLogout} className="cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" >
              Entre ou Cadastre-se
            </Link>
          )}
        </div>
    </nav>
  );
}

export default Navbar;
