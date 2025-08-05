import { useState, useEffect } from "react";
import api from "../api";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const predefinedTags = [
  "Cachorro",
  "Gato",
  "Urgente",
  "Filhote",
  "Vacina",
  "Castrado",
  "Adoção",
  "Pequeno porte",
  "Médio porte",
  "Grande porte",
  "Amigável",
  "Brincalhão",
  "Calmo",
  "Agressivo",
  "Idoso",
  "Doente",
  "Cego",
  "Surdo",
  "Resgatado",
  "Lar temporário",
];

function DisplayPosts({ page }) {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhone, setModalPhone] = useState("");

  const [filters, setFilters] = useState({ state: "", city: "", tags: [] });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ───── Effects ─────
  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (filters.state) fetchCities(filters.state);
    else setCities([]);
  }, [filters.state]);

  useEffect(() => {
    fetchPosts();
  }, [page, filters]);

  // ───── API Calls ─────
  const fetchStates = async () => {
    try {
      const res = await api.get("/locations/states");
      setStates(res.data);
    } catch (e) {
      console.error("Erro ao buscar estados:", e);
    }
  };

  const fetchCities = async (state) => {
    try {
      const res = await api.get(`/locations/getCity/${state}`);
      setCities(res.data);
    } catch (e) {
      console.error("Erro ao buscar cidades:", e);
    }
  };

  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams();
      if (page) query.append("page", page);
      if (filters.state) query.append("state", filters.state);
      if (filters.city) query.append("city", filters.city);
      if (filters.tags.length > 0) query.append("tags", filters.tags.join(","));
      const res = await api.get(`/posts/filter?${query.toString()}`);
      setPosts(res.data);
    } catch (e) {
      console.error("Erro ao buscar posts:", e);
    }
  };

  const checkLogged = async () => {
    try {
      const res = await api.get("/validate");
      return res.data.valid === true;
    } catch {
      return false;
    }
  };

  const handleGetUserContact = async (postId) => {
    if (!(await checkLogged())) {
      alert("Você precisa estar logado para entrar em contato");
      return;
    }

    try {
      const res = await api.get(`/posts/getUserInfo/${postId}`);
      const phone = res.data.author.phone;
      setContacts((prev) => ({ ...prev, [postId]: phone }));
      setModalPhone(phone);
      setModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTag = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // ───── Render ─────
  return (
    <>
      {/* Filtros */}
      <div className="filters p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Filtrar resultados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value, city: "" })
              }
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Selecione um estado</option>
              {states.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              disabled={!filters.state}
              className="w-full border rounded-lg px-3 py-2 disabled:opacity-50"
            >
              <option value="">Selecione uma cidade</option>
              {cities.map((c) => (
                <option key={c.city} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border ${
                  filters.tags.includes(tag)
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards de post */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
        {posts.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            Nenhum post encontrado.
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg flex flex-col p-4"
          >
            {post.imagesUrl?.length > 0 && (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="w-full h-[300px] mb-4"
              >
                {post.imagesUrl.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={`http://localhost:3000/${img}`}
                      alt={`Imagem ${i + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="mb-4">{post.content}</p>
            <p className="mb-4 text-gray-600">
              {post.location?.city}, {post.location?.state}
            </p>

            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-200 text-gray-700 px-3 py-1 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => handleGetUserContact(post.id)}
              className="bg-blue-500 my-5 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Entrar em contato
            </button>
          </div>
        ))}
      </div>

      {/* Modal de contato */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Contato</h2>
            <p className="text-lg font-medium text-gray-700 text-center mb-4">
              Telefone: <span className="font-semibold">{modalPhone}</span>
            </p>

            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  "Olá, gostaria de mais informações sobre a adoção do pet!"
                );
                const phone = modalPhone.replace(/\D/g, "");
                window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mx-auto"
            >
              <FaWhatsapp className="text-2xl" />
              Enviar mensagem
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-red-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de contato */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-200 shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Contato</h2>
            <p className="text-lg font-medium text-gray-700 text-center mb-4">
              Telefone: <span className="font-semibold">{modalPhone}</span>
            </p>

            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  "Olá, gostaria de mais informações sobre a adoção do pet!"
                );
                const phone = modalPhone.replace(/\D/g, "");
                window.open(`https://wa.me/55${phone}?text=${msg}`, "_blank");
              }}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mx-auto"
            >
              <FaWhatsapp className="text-2xl" />
              Enviar mensagem
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-red-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DisplayPosts;
