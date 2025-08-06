import { useState, useEffect, useRef } from "react";
import api from "../api";
import TagsInput from "./TagsInput";

function EditPostModal({ post, onClose, onUpdate }) {
  
    const [postForm, setPostForm] = useState({
    title: post.title || "",
    tags: post.tags || [],
    content: post.content || "",
    state: post.location?.state || "",
    city: post.location?.city || "",
    locationId: post.location_id || "",
  });
  

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

  useEffect(() => {
    fetchStates();
    if (postForm.state) fetchCities(postForm.state);
  }, []);

  const fetchStates = async () => {
    const res = await api.get("/locations/states");
    const stateList = res.data.map((s) => s.state);
    setStates(stateList);
  };

  const fetchCities = async (state) => {
    const res = await api.get(`/locations/getCity/${state}`);
    const cityList = res.data.map((c) => c.city);
    setCities(cityList);
  };

  const setTags = (tags) => {
    setPostForm((prev) => ({ ...prev, tags }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const valid = selectedFiles.filter((f) => allowedTypes.includes(f.type));
    setImages(valid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      console.log(postForm.title)
      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      formData.append("tags", postForm.tags.join(","));
      formData.append("location_id", postForm.locationId);

      images.forEach((file) => formData.append("files", file));

      await api.put(`/posts/edit/${post.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar post.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Editar Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nome</label>
            <input
              type="text"
              value={postForm.title}
              onChange={(e) =>
                setPostForm({ ...postForm, title: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nova(s) Imagem(ns)</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm cursor-pointer"
            />
          </div>
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

          <div>
            <label className="block font-medium mb-1">Características</label>
            <TagsInput tags={postForm.tags} setTags={setTags} />
          </div>

          <div>
            <label className="block font-medium mb-1">Descrição</label>
            <textarea
              value={postForm.content}
              onChange={(e) =>
                setPostForm({ ...postForm, content: e.target.value })
              }
              rows={4}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Estado</label>
            <select
              value={postForm.state}
              onChange={async (e) => {
                const state = e.target.value;
                setPostForm({ ...postForm, state, city: "", locationId: "" });
                await fetchCities(state);
              }}
              required
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Selecione um estado</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Cidade</label>
            <select
              value={postForm.city}
              onChange={async (e) => {
                const city = e.target.value;
                setPostForm((prev) => ({ ...prev, city }));
                const res = await api.get(
                  `/locations/${postForm.state}/${city}`
                );
                setPostForm((prev) => ({ ...prev, locationId: res.data.id }));
              }}
              required
              disabled={!postForm.state}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="">Selecione uma cidade</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPostModal;
