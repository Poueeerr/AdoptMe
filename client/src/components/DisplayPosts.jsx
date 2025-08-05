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

  // Filtros
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    tags: [],
  });

  // Estados e cidades para os selects
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Buscar estados ao montar componente
  useEffect(() => {
    async function fetchStates() {
      try {
        const res = await api.get("/locations/states");
        setStates(res.data);
      } catch (e) {
        console.error("Erro ao buscar estados:", e);
      }
    }
    fetchStates();
  }, []);

  // Buscar cidades quando estado mudar
  useEffect(() => {
    async function fetchCities() {
      if (filters.state) {
        try {
          const res = await api.get(`/locations/getCity/${filters.state}`);
          setCities(res.data);
        } catch (e) {
          console.error("Erro ao buscar cidades:", e);
          setCities([]);
        }
      } else {
        setCities([]);
      }
    }
    fetchCities();
  }, [filters.state]);

  // Buscar posts filtrados sempre que page ou filters mudarem
  useEffect(() => {
    async function fetchPosts() {
      try {
        const query = new URLSearchParams();
        if (page) query.append("page", page);
        if (filters.state) query.append("state", filters.state);
        if (filters.city) query.append("city", filters.city);
        if (filters.tags.length > 0)
          query.append("tags", filters.tags.join(","));

        // Endpoint ajustado para filtro
        const response = await api.get(`/posts/filter?${query.toString()}`);
        setPosts(response.data);
      } catch (e) {
        console.error("Erro ao buscar posts:", e);
      }
    }
    fetchPosts();
  }, [page, filters]);

  // Verifica login para contato
  const checkLogged = async () => {
    try {
      const response = await api.get("/validate");
      return response.data.valid === true;
    } catch (e) {
      return false;
    }
  };

  // Buscar telefone e abrir modal
  const handleGetUserContact = async (id) => {
    try {
      if (await checkLogged()) {
        const response = await api.get(`/posts/getUserInfo/${id}`);
        const phone = response.data.author.phone;
        setContacts((prev) => ({ ...prev, [id]: phone }));
        setModalPhone(phone);
        setModalOpen(true);
      } else {
        alert("Você precisa estar logado para entrar em contato");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Alterna tag nos filtros
  const toggleTag = (tag) => {
    setFilters((prev) => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter((t) => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  return (
    <>
      {/* Filtros */}
      <div className="filters p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Filtrar resultados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.state}
              onChange={(e) =>
                setFilters({ ...filters, state: e.target.value, city: "" })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selecione um estado</option>
              {states.map((stateObj) => (
                <option key={stateObj.state} value={stateObj.state}>
                  {stateObj.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cidade
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              disabled={!filters.state}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            >
              <option value="">Selecione uma cidade</option>
              {cities.map((cityObj) => (
                <option key={cityObj.city} value={cityObj.city}>
                  {cityObj.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  filters.tags.includes(tag)
                    ? "bg-blue-500 text-white border-blue-600"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de posts */}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {posts.length === 0 && (
          <p className="col-span-5 text-center text-gray-500">
            Nenhum post encontrado.
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg flex flex-col p-4"
          >
            <div className="flex justify-center mb-4 ">
              {post.imagesUrl?.length > 0 && (
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="w-full h-[300px] mb-4"
                >
                  {post.imagesUrl.map((image, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={`http://localhost:3000/${image}`}
                        alt={`Imagem ${i + 1} do post`}
                        className="w-full h-full object-cover rounded-md shadow-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="mb-4">{post.content}</p>
            <p className="mb-4  text-gray-600">
              {post.location?.city}, {post.location?.state}
            </p>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-200 text-gray-700 px-3 py-1 text-sm shadow-sm hover:bg-gray-300 transition-colors cursor-default"
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
            <div className="flex flex-col items-center text-center space-y-4">
              <p className="text-lg font-medium text-gray-700">
                Telefone para contato:{" "}
                <span className="font-semibold text-black">{modalPhone}</span>
              </p>

              <div className="relative group">
                <button
                  onClick={() => {
                    const message =
                      "Olá, gostaria de mais informações sobre a adoção do pet!";
                    const encodedMessage = encodeURIComponent(message);
                    const phone = modalPhone.replace(/\D/g, "");
                    window.open(
                      `https://wa.me/55${phone}?text=${encodedMessage}`,
                      "_blank"
                    );
                  }}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                >
                  <FaWhatsapp className="text-2xl" />
                  Enviar mensagem
                </button>

                <div className="w-max absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                  {`https://wa.me/55${modalPhone}`}
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(false)}
              className=" text-xl absolute top-2 right-2 text-red-600 hover:text-gray-900 cursor-pointer"
              aria-label="Fechar modal"
            >
              ✕
            </button>
            <button
              onClick={() => setModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DisplayPosts;
