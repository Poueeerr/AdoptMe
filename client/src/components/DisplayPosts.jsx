import { useState, useEffect } from "react";
import api from "../api";
import { FaWhatsapp } from "react-icons/fa";

function DisplayPosts({ page }) {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhone, setModalPhone] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/posts/getPage/${page}`);
        setPosts(response.data);
      } catch (e) {
        console.log(e);
      }
    }
    if (page) {
      fetchData();
    }
  }, [page]);

  const checkLogged = async () => {
    try {
      const response = await api.get("/validate");
      return response.data.valid === true;
    } catch (e) {
      return false;
    }
  };

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

  return (
    <>
      <div className="grid grid-cols-5 gap-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg flex flex-col p-4"
          >
            <div className="flex justify-center mb-4">
              {post.imagesUrl?.map((image, i) => (
                <img
                  key={i}
                  src={`http://localhost:3000/${image}`}
                  alt={`Imagem ${i + 1} do post`}
                  className="w-[200px] h-[200px] object-cover"
                />
              ))}
            </div>

            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="mb-4">{post.content}</p>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
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
                  onClick={() =>
                    window.open(
                      `https://wa.me/55${modalPhone}?text=Ol%C3%A1,%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20ado%C3%A7%C3%A3o%20do%20pet!`,
                      "_blank"
                    )
                  }
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                >
                  <FaWhatsapp className="text-2xl" />
                  Enviar mensagem
                </button>

                {/* Tooltip */}
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
