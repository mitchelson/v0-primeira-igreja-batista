import React from 'react';
import '../styles/landing-page.css';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-cover bg-center h-screen text-white" style={{ backgroundImage: "url('https://picsum.photos/1200/800')" }}>
        <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Bem-vindo à nossa Igreja</h1>
            <p className="text-xl mb-8">Um lugar de fé, esperança e amor.</p>
            <a href="#about" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Saiba Mais
            </a>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Sobre Nós</h2>
          <p className="text-lg max-w-3xl mx-auto">
            Somos uma comunidade de fiéis dedicados a adorar a Deus e a servir ao próximo. A nossa missão é espalhar a palavra de Deus e o seu amor a todos.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Nossos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Culto de Domingo</h3>
              <p className="text-gray-600">Todos os domingos às 10h. Junte-se a nós para um tempo de louvor e adoração.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Estudo Bíblico</h3>
              <p className="text-gray-600">Todas as quartas-feiras às 19h. Aprofunde o seu conhecimento da Bíblia.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Grupo de Jovens</h3>
              <p className="text-gray-600">Todas as sextas-feiras às 20h. Um tempo de comunhão e diversão para os jovens.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Nossos Ministérios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Ministério Infantil</h3>
              <p className="text-gray-600">Ensinando as crianças sobre o amor de Deus de uma forma divertida e interativa.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Ministério de Louvor</h3>
              <p className="text-gray-600">Liderando a congregação na adoração através da música.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Ministério de Ação Social</h3>
              <p className="text-gray-600">Servindo a nossa comunidade e ajudando os necessitados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-lg mb-8">Gostaríamos muito de ouvir de você. Entre em contato conosco para mais informações.</p>
          <p className="text-lg">Endereço: Rua da Igreja, 123, Cidade, Estado</p>
          <p className="text-lg">Telefone: (00) 1234-5678</p>
          <p className="text-lg">Email: contato@igreja.com</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
