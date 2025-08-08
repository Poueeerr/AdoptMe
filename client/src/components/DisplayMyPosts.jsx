import { useState } from "react";
import api from "../api";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import EditPostModal from "./EditPostModal";
import "swiper/css/pagination";
import { jwtDecode } from "jwt-decode";

function DisplayMyPosts() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

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

  const fetchData = async () => {
    try {
      const userId = getUserIdFromToken();
      const response = await api.get(`/posts/getByUser/${userId}`);
      setPosts(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/deletePost/${id}`);
      fetchData();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {editingPost && editingPost.title && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={fetchData}
        />
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-4">
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
                        //                      src={`https://backend-adopt.onrender.com/${img}`}
                        alt={`Imagem ${i + 1}`}
                        src={`https://backend-adopt.onrender.com/${img}`}
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
              <div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="mt-4 text-red-700 font-bold hover:text-red-900 cursor-pointer"
                >
                  DELETAR
                </button>
                <button
                  onClick={() => setEditingPost(post)}
                  className="mt-2 text-blue-700 font-bold hover:text-blue-900 cursor-pointer ml-10"
                >
                  EDITAR
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>Parece que você não possui nenhuma divulgação</p>
        </div>
      )}
    </>
  );
}

export default DisplayMyPosts;
