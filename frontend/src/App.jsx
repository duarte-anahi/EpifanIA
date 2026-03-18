import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './index.css'
import { SelectorPerfil } from './SelectorPerfil'

// --- CONFIGURACIÓN ---
const API_URL = "http://127.0.0.1:8000/generar-pregunta";

const MODELOS = {
  OFICIAL: "Oficial (Educado)",
  CREATIVO: "Creativo (Hermes)"
};

function App() {
  // --- ESTADOS ---
  const [perfil, setPerfil] = useState(null)
  const [texto, setTexto] = useState('')
  const [sugerencia, setSugerencia] = useState('')
  const [cargando, setCargando] = useState(false)
  const [inputPersonalizado, setInputPersonalizado] = useState('')
  const [modeloSeleccionado, setModeloSeleccionado] = useState(MODELOS.OFICIAL)
  const [etapa, setEtapa] = useState(null);

  const pedirAyuda = async (instruccion, validacionTexto = false) => {
    // Si la etapa requiere texto (como organizar o pulir) y está vacío, mostramos el aviso de la imagen
    if (validacionTexto && !texto.trim()) {
      setSugerencia("Para esta etapa necesito material. Como seleccionaste una opción de revisión o estructura, necesito que pegues tus apuntes o borrador en el editor primero.\n\nSi estás en cero, prueba el botón **'Lluvia de Ideas'**.");
      return;
    }

    if (validacionTexto === false && !texto.trim() && instruccion !== "Genera 5 posibles ángulos o temas para arrancar en base a 3 palabras clave") {
        return;
    }

    setCargando(true);
    setSugerencia('');

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: texto,
          instruccion: instruccion,
          modelo: modeloSeleccionado,
          perfil: perfil
        }),
      })

      if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
      const datos = await respuesta.json()
      setSugerencia(datos.respuesta_caliope)

    } catch (error) {
      console.error(error)
      setSugerencia("⚠️ Error de conexión con el servidor local.")
    } finally {
      setCargando(false)
      setInputPersonalizado('')
    }
  }

  // --- RENDERIZADO CONDICIONAL ---
  if (!perfil) {
    return <SelectorPerfil alSeleccionar={(p) => setPerfil(p)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] text-slate-800 overflow-hidden font-sans">
      
      {/* HEADER SUPERIOR IZQUIERDO */}
      <div className="absolute top-6 left-8 z-50 flex flex-col gap-1">
        <button 
          onClick={() => {setPerfil(null); setEtapa(null); setSugerencia('');}}
          className="text-[10px] font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest flex items-center gap-2"
        >
          ← Cambiar Perfil ({perfil})
        </button>
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Tu espacio de trabajo</h2>
      </div>

      {/* ÁREA DEL EDITOR (HOJA) */}
      <div className="flex-1 flex justify-center items-center p-20 relative">
        <div className="w-full max-w-3xl h-[85vh] bg-white rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100 p-12 relative">
          <textarea
            className="w-full h-full text-lg text-slate-600 placeholder-slate-300 focus:outline-none resize-none leading-relaxed"
            placeholder="Tu redacción comienza acá..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            spellCheck="false"
            autoFocus
          />

          {/* CUADRO DE SUGERENCIA FLOTANTE (Estilo imagen) */}
          {sugerencia && (
            <div className="absolute bottom-10 right-[-50px] w-80 bg-[#fffdf0] border border-yellow-200 rounded-xl shadow-2xl p-5 animate-in fade-in slide-in-from-right-4 duration-300 z-50">
                <button onClick={() => setSugerencia('')} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-xs">✕</button>
                <h4 className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest mb-3">Sugerencia Epifanía</h4>
                <div className="text-[12px] text-slate-700 leading-relaxed">
                    <ReactMarkdown>{sugerencia}</ReactMarkdown>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* BARRA LATERAL DERECHA */}
      <aside className="w-[350px] bg-white border-l border-slate-100 p-8 flex flex-col gap-10 shadow-sm z-10">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-cyan-800 tracking-tighter">EpifanIA</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">Asistente de escritura</p>
        </div>

        {/* SELECTOR DE MODELO */}
        <div>
          <label className="text-[10px] text-slate-400 uppercase font-bold mb-3 block tracking-wider">Seleccionar Modelo</label>
          <select 
            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm text-slate-600 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer"
            value={modeloSeleccionado}
            onChange={(e) => setModeloSeleccionado(e.target.value)}
          >
            <option value={MODELOS.OFICIAL}>🧠 Llama 3</option>
            <option value={MODELOS.CREATIVO}>✨ Hermes 3</option>
          </select>
        </div>

        {/* ETAPAS (Botones grandes de la imagen) */}
        <div className="flex flex-col gap-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">¿En qué etapa estás?</label>
          
          <button 
            onClick={() => {setEtapa('lluvia'); pedirAyuda("Genera 5 posibles ángulos o temas para arrancar en base a 3 palabras clave", false);}}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border text-left ${etapa === 'lluvia' ? 'bg-cyan-50/50 border-cyan-200 shadow-sm' : 'bg-white border-slate-100 hover:border-cyan-100 hover:bg-slate-50'}`}
          >
            <div className="bg-yellow-100/50 p-2 rounded-lg text-xl">💡</div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">1. Lluvia de Ideas</h4>
              <p className="text-[10px] text-slate-400">Hoja en blanco. ¡Ayuda!</p>
            </div>
          </button>

          <button 
            onClick={() => {setEtapa('organizar'); pedirAyuda("Analiza mis notas y propón una estructura lógica con títulos.", true);}}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border text-left ${etapa === 'organizar' ? 'bg-cyan-50/50 border-cyan-200 shadow-sm' : 'bg-white border-slate-100 hover:border-cyan-100 hover:bg-slate-50'}`}
          >
            <div className="bg-blue-100/50 p-2 rounded-lg text-xl">📝</div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">2. Organizar</h4>
              <p className="text-[10px] text-slate-400">Tengo apuntes, necesito estructura.</p>
            </div>
          </button>

          <button 
            onClick={() => {setEtapa('pulir'); pedirAyuda("Actúa como corrector de estilo y sugiere mejoras de claridad.", true);}}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border text-left ${etapa === 'pulir' ? 'bg-cyan-50/50 border-cyan-200 shadow-sm' : 'bg-white border-slate-100 hover:border-cyan-100 hover:bg-slate-50'}`}
          >
            <div className="bg-teal-100/50 p-2 rounded-lg text-xl">✨</div>
            <div>
              <h4 className="text-sm font-bold text-slate-700">3. Pulir y mejorar</h4>
              <p className="text-[10px] text-slate-400">Ya escribí, quiero revisar.</p>
            </div>
          </button>
        </div>

        {/* INPUT LIBRE AL FINAL */}
        <div className="mt-auto">
          <div className="relative">
            <input
              type="text"
              className="w-full bg-slate-50 border-none rounded-xl p-4 pr-12 text-sm text-slate-600 focus:ring-2 focus:ring-teal-500/20 placeholder-slate-300"
              placeholder="Pregunta libre..."
              value={inputPersonalizado}
              onChange={(e) => setInputPersonalizado(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && pedirAyuda(inputPersonalizado)}
            />
            <button 
               onClick={() => pedirAyuda(inputPersonalizado)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-800 p-2"
            >
              ➤
            </button>
          </div>
          {cargando && <p className="text-[9px] text-teal-600 text-center mt-2 animate-pulse font-bold uppercase tracking-widest">IA Procesando...</p>}
        </div>
      </aside>
    </div>
  )
}

export default App