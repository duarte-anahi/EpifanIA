

export const SelectorPerfil = ({ alSeleccionar }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-6xl font-bold text-teal-400 mb-2">EpifanIA</h1>
      <p className="text-xl mb-12">Tu asistente de escritura. Selecciona tu perfil.</p>
      
      <div className="flex gap-16">
        {/* Opción Estudiante */}
        <button onClick={() => alSeleccionar('estudiante')} className="group flex flex-col items-center focus:outline-none">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform cursor-pointer">🎓</div>
          <h2 className="text-2xl font-semibold">Estudiante</h2>
          <p className="text-gray-400 text-sm max-w-[200px] text-center">Ayúdame a estudiar, redactar y mejorar.</p>
        </button>

        {/* Opción Docente */}
        <button onClick={() => alSeleccionar('docente')} className="group flex flex-col items-center focus:outline-none">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform cursor-pointer">🍎</div>
          <h2 className="text-2xl font-semibold">Docente</h2>
          <p className="text-gray-400 text-sm max-w-[200px] text-center">Ayúdame a planificar, estructurar y evaluar.</p>
        </button>
      </div>
    </div>
  );
};