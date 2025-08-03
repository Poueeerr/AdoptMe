function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0 text-sm">
          &copy; {new Date().getFullYear()} Poueeerr. Todos os direitos reservados.
        </div>

        <div className="flex space-x-6">
          <a
            href="/"
            className="hover:text-blue-300 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="/adotar"
            className="hover:text-blue-300 transition-colors duration-200"
          >
            Adotar
          </a>
          <a
            href="/divulgar"
            className="hover:text-blue-300 transition-colors duration-200"
          >
            Divulgar Adoção
          </a>
          <a
            href="/auth"
            className="hover:text-blue-300 transition-colors duration-200"
          >
            Login / Cadastro
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
