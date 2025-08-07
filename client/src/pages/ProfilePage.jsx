import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";

function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  function getUserIdFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.id || null;
    } catch (error) {
      console.error("Token inválido:", error);
      return null;
    }
  }

  const fetchUserData = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) return;

      const response = await api.get(`users/id/${userId}`);
      setUserData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
      });
    } catch (e) {
      console.error("Erro ao buscar dados do usuário:", e);
    }
  };

  const handleEdit = (field) => {
    setEditingField(field);
    const value = userData[field];
    setFieldValue(field === "phone" ? formatPhone(value) : value);
  };
  const isValidName = (name) => /^[A-Za-zÀ-ÿ\s]{2,}$/.test(name.trim());

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isValidPhone = (phone) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  };

  const handleSave = async (field) => {
    try {
      const userId = getUserIdFromToken();
      const cleanValue =
        field === "phone" ? fieldValue.replace(/\D/g, "") : fieldValue.trim();

      if (field === "name" && !isValidName(cleanValue)) {
        alert(
          "Nome inválido. Use pelo menos 2 letras, sem números ou símbolos."
        );
        return;
      }

      if (field === "email" && !isValidEmail(cleanValue)) {
        alert("E-mail inválido. Informe um e-mail válido.");
        return;
      }

      if (field === "phone" && !isValidPhone(cleanValue)) {
        alert("Telefone inválido. Use DDD e número com pelo menos 10 dígitos.");
        return;
      }

      if (!cleanValue || cleanValue === userData[field]) {
        setEditingField(null);
        return;
      }

      await api.patch(`/users/edit/${userId}`, { [field]: cleanValue });

      setUserData((prev) => ({ ...prev, [field]: cleanValue }));
      setEditingField(null);
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setFieldValue("");
  };

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderField = (label, field) => {
    const isEditing = editingField === field;
    const value = userData[field];

    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <input
                type="text"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={fieldValue}
                onChange={(e) =>
                  setFieldValue(
                    field === "phone"
                      ? formatPhone(e.target.value)
                      : e.target.value
                  )
                }
              />
              <button
                onClick={() => handleSave(field)}
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 transition cursor-pointer"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <input
                type={"text"}
                value={field === "phone" ? formatPhone(value) : value}
                disabled
                className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 text-gray-700"
              />
              <button
                onClick={() => handleEdit(field)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-blue-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-8 text-blue-700 text-center">
            Perfil do Usuário
          </h1>

          <img
            src="omgHiKitty.png"
            alt="photo"
            className="mx-auto w-64 h-64 rounded-full object-cover mb-8 shadow-lg hover:scale-105 transition"
          />

          {renderField("Nome", "name")}
          {renderField("Email", "email")}
          {renderField("Telefone", "phone")}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
