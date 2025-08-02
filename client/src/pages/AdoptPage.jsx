import { useState, useEffect } from "react";
import DisplayPosts from "../components/DisplayPosts";
import api from "../api";

function Adotar() {
  const [pageAtual, setPageAtual] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    async function getPageSize() {
      const response = await api.get("/posts/postSize");
      setPageSize(response.data);
      setPageAtual(1);
    }
    getPageSize();
  }, []);

  const handlePrev = () => {
    setPageAtual((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPageAtual((prev) => Math.min(prev + 1, pageSize));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex flex-col">
      <div className="flex justify-between items-center px-6 pt-4">
        <div>
          <p className="text-xl font-bold">Pets para adoção</p></div>
        <div className="flex justify-end px-6 pt-4">
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={pageAtual === 1}
              className={`px-3 py-1 rounded font-medium text-sm transition ${
                pageAtual === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }`}
            >
              ← Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={pageAtual === pageSize}
              className={`px-3 py-1 rounded font-medium text-sm transition ${
                pageAtual === pageSize
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }`}
            >
              Próximo →
            </button>
          </div>
        </div>
      </div>

      {/* POSTS */}
      <div className="flex-1 px-6 py-4">
        <DisplayPosts page={pageAtual} />
      </div>

      {/* RODAPÉ com botões e numeração */}
      <footer className="w-full bg-gray-200 py-3 px-4 flex justify-center">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={handlePrev}
            disabled={pageAtual === 1}
            className={`px-3 py-1 rounded font-medium text-sm transition ${
              pageAtual === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-200"
            }`}
          >
            ← Voltar
          </button>

          {Array.from({ length: pageSize }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setPageAtual(index + 1)}
              className={`px-3 py-1 rounded font-medium text-sm transition ${
                pageAtual === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={pageAtual === pageSize}
            className={`px-3 py-1 rounded font-medium text-sm transition ${
              pageAtual === pageSize
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-gray-300 hover:bg-gray-200"
            }`}
          >
            Avançar →
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Adotar;
