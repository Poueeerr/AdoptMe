import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function AuthPage() {
  const [userDataLog, setUserDataLog] = useState({
    email: "",
    password: "",
  });

  const [userDataReg, setUserDataReg] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginView, setLoginView] = useState(true);
  const nav = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const formatPhone = (value) => {
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length === 0) return "";
    if (onlyNums.length <= 2) return `(${onlyNums}`;
    if (onlyNums.length <= 7)
      return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2)}`;
    if (onlyNums.length <= 11)
      return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(
        2,
        7
      )}-${onlyNums.slice(7)}`;
    return `(${onlyNums.slice(0, 2)}) ${onlyNums.slice(2, 7)}-${onlyNums.slice(
      7,
      11
    )}`;
  };

  const isLogged = async () => {
    try {
      const response = await api.get("/validate");
      return response.data.valid === true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const logged = await isLogged();
      if (logged) nav("/");
    };
    checkLogin();
  }, [nav]);

  const loginFormValid = () => {
    const { email, password } = userDataLog;
    const basicValid = [password, email].every((field) => field.trim() !== "");
    const validEmail = email.includes("@");
    return basicValid && validEmail;
  };

  const registerFormValid = () => {
    const { name, email, phone, password } = userDataReg;

    const basicValid = [name, email, password].every(
      (field) => field.trim() !== ""
    );
    const validEmail = email.includes("@");
    const digitsOnly = phone.replace(/\D/g, "");
    const phoneValid = digitsOnly.length === 11;

    return basicValid && phoneValid && validEmail;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!loginFormValid()) {
        alert("Preencha todos os campos corretamente");
        return;
      }
      const response = await api.post("/users/login", userDataLog);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", response.data.name);
      window.location.reload();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!registerFormValid()) {
        alert("Preencha todos os campos corretamente");
        return;
      }
      await api.post("/users/register", userDataReg);
      setUserDataLog({
        email: userDataReg.email,
        password: userDataReg.password,
      });
      setLoginView(true);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-600 p-6">
      <div className="flex w-full max-w-5xl rounded-xl shadow-lg overflow-hidden bg-white">
        <div className="hidden md:flex flex-1">
          <img
            src="../public/kitty.jpg"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col flex-1 p-10 min-h-[700px]">
          {loginView ? (
            <>
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                LOGIN
              </h1>
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-6 flex-grow justify-center"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="email"
                    placeholder="@mail.com"
                    value={userDataLog.email}
                    onChange={(e) =>
                      setUserDataLog({ ...userDataLog, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      value={userDataLog.password}
                      onChange={(e) =>
                        setUserDataLog({
                          ...userDataLog,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    Esqueceu a Senha?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!loginFormValid()}
                  className={`w-full text-white font-semibold rounded-lg py-3 transition ${
                    !loginFormValid()
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  Entrar
                </button>
              </form>
              <p
                onClick={() => setLoginView(false)}
                className="cursor-pointer text-center mt-6 text-blue-600 hover:underline"
              >
                Não Tem Uma Conta?{" "}
                <span className="font-semibold">Inscrever-se</span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                Cadastro
              </h1>
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-6 flex-grow justify-center"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={userDataReg.name}
                    onChange={(e) =>
                      setUserDataReg({ ...userDataReg, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={userDataReg.email}
                    onChange={(e) =>
                      setUserDataReg({ ...userDataReg, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={userDataReg.password}
                      onChange={(e) =>
                        setUserDataReg({
                          ...userDataReg,
                          password: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={userDataReg.phone}
                    onChange={(e) =>
                      setUserDataReg({
                        ...userDataReg,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!registerFormValid()}
                  className={`w-full text-white font-semibold rounded-lg py-3 transition ${
                    !registerFormValid()
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  }`}
                >
                  Registrar
                </button>
              </form>
              <p
                onClick={() => setLoginView(true)}
                className="cursor-pointer text-center mt-6 text-blue-600 hover:underline"
              >
                Já tem uma conta? Clique aqui!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
