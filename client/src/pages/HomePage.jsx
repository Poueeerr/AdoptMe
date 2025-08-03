function Home() {
  return (
    <div className="bg-blue-100">
      
    <div className="bg-blue-100 min-h-screen px-8 py-12 max-w-7xl mx-auto text-gray-900">
      
      <section className="text-center max-w-4xl mx-auto mb-24">
        <p className="uppercase text-sm text-gray-500 mb-4 tracking-wide">Sobre Nós</p>
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Adoção responsável com <span className="text-cyan-500">amor e cuidado</span>
        </h1>
        <img
          src="../public/doggy.jpg" 
          alt="Pet feliz"
          className="mx-auto w-72 rounded-xl mb-8 shadow-lg"
        />
        <p className="text-gray-700 text-lg max-w-3xl mx-auto leading-relaxed">
          Somos uma plataforma dedicada a conectar pets incríveis que buscam um lar cheio de amor.
          Aqui você pode divulgar, encontrar e ajudar pets a terem uma nova chance.
        </p>
        <button
          onClick={() => window.location.href = "/adotar"}
          className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-cyan-600 transition"
        >
          Comece a Adoção
        </button>
      </section>

      {/* Experiência / Porque escolher */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div>
          <h2 className="text-3xl font-bold mb-4 border-b-4 border-cyan-500 inline-block pb-2">
            Nossa Missão
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Promover o bem-estar animal conectando pessoas que amam pets com aqueles que precisam de um lar,
            garantindo que cada adoção seja segura e responsável.
          </p>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-4 border-b-4 border-purple-600 inline-block pb-2">
            O que oferecemos
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>Divulgação fácil e gratuita de pets para adoção.</li>
            <li>Comunidade dedicada e suporte para adotantes e doadores.</li>
            <li>Filtros para encontrar o pet ideal para seu estilo de vida.</li>
            <li>Dicas e conteúdos sobre cuidados e bem-estar animal.</li>
          </ul>
        </div>
      </section>
    </div>

    </div>
  );
}

export default Home;
