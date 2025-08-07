import { useState, useRef, useEffect } from "react";
import api from "../api";
import TagsInput from "./TagsInput";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();
  const [postForm, setPostForm] = useState({
    title: "",
    tags: [],
    content: "",
    state: "",
    city: "",
    locationId: "",
  });

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [allowForm, setAllowForm] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    checkLogged();
    fetchStates();
  }, []);

  const checkLogged = async () => {
    try {
      const response = await api.get("/validate");
      setAllowForm(response.data.valid === true);
      if (!response.data.valid) {
        alert("Você precisa estar logado para realizar uma postagem");
      }
    } catch {
      setAllowForm(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await api.get("/locations/states");
      const stateList = res.data.map((s) => s.state);
      setStates(stateList);
    } catch (err) {
      console.error("Erro ao buscar estados:", err);
    }
  };

  const setTags = (tags) => {
    setPostForm((prev) => ({ ...prev, tags }));
  };

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    selectedFiles.forEach((file) => {
      if (allowedTypes.includes(file.type.toLowerCase())) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      alert(
        `Os seguintes arquivos não são permitidos:\n${invalidFiles.join("\n")}`
      );
      clearFiles();
    }

    setImages(validFiles);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handlePostForm = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Por favor, selecione ao menos uma imagem.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      formData.append("tags", postForm.tags.join(","));
      formData.append("location_id", postForm.locationId);

      for (const file of images) {
        formData.append("files", file);
      }

      await api.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Post criado com sucesso!");
      setPostForm({
        title: "",
        tags: [],
        content: "",
        state: "",
        city: "",
        locationId: "",
      });
      clearFiles();
      navigate("/userposts", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Erro ao criar post");
    }
  };

  if (!allowForm) return null;

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-200 to-blue-500 p-6">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Divulgar Adoção
        </h2>
        <form onSubmit={handlePostForm} className="space-y-6">
          <div>
            <label className="block font-medium mb-1">
              Nome do seu pet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={postForm.title}
              onChange={(e) =>
                setPostForm({ ...postForm, title: e.target.value })
              }
              placeholder="Ex: Mia"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Coloque uma foto bem bonita dele!{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-[200px] h-[200px] rounded-md border overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length > 0 && (
              <button
                type="button"
                onClick={clearFiles}
                className="mt-2 text-sm text-red-500 hover:underline"
              >
                Apagar todas as imagens
              </button>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Características <span className="text-red-500">*</span>
            </label>
            <TagsInput tags={postForm.tags} setTags={setTags} />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Fale um pouco sobre seu pet!{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={postForm.content}
              onChange={(e) =>
                setPostForm({ ...postForm, content: e.target.value })
              }
              placeholder="Descreva seu animalzinho da melhor forma!"
              required
              rows={6}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Estado em que está! <span className="text-red-500">*</span>
            </label>
            <select
              value={postForm.state}
              onChange={async (e) => {
                const selectedState = e.target.value;
                setPostForm({
                  ...postForm,
                  state: selectedState,
                  city: "",
                  locationId: "",
                });

                try {
                  const res = await api.get(
                    `/locations/getCity/${selectedState}`
                  );
                  const cityNames = res.data.map((loc) => loc.city);
                  setCities(cityNames);
                } catch (e) {
                  console.error("Erro ao buscar cidades:", e);
                }
              }}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione um estado</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Cidade em que está! <span className="text-red-500">*</span>
            </label>
            <select
              value={postForm.city}
              onChange={async (e) => {
                const selectedCity = e.target.value;
                setPostForm((prev) => ({ ...prev, city: selectedCity }));

                if (postForm.state && selectedCity) {
                  try {
                    const res = await api.get(
                      `/locations/${postForm.state}/${selectedCity}`
                    );
                    setPostForm((prev) => ({
                      ...prev,
                      locationId: res.data.id,
                    }));
                  } catch (err) {
                    console.error("Erro ao buscar locationId:", err);
                  }
                }
              }}
              required
              disabled={!postForm.state}
              className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                !postForm.state
                  ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed"
                  : "border border-gray-300 focus:ring-blue-400"
              }`}
            >
              <option value="">Selecione uma cidade</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 font-bold text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Enviar Adoção!
            </button>
          </div>
          <div className="text-center">
            <p className="font-bold text-red-600">
              Por favor tenha em mente que o número cadastrado em sua conta será
              disponibilizado para contato!
            </p>
          </div>  
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
