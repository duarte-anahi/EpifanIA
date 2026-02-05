import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './index.css'

// --- CONFIGURACIÓN ---
const API_URL = "http://127.0.0.1:8000/generar-pregunta";

const MODELOS = {
  OFICIAL: "Oficial (Educado)",
  CREATIVO: "Creativo (Hermes)"
};

function App() {
  const [texto, setTexto] = useState('')
  const [sugerencia, setSugerencia] = useState('')
  const [cargando, setCargando] = useState(false)
  const [inputPersonalizado, setInputPersonalizado] = useState('')
  const [modeloSeleccionado, setModeloSeleccionado] = useState(MODELOS.OFICIAL)

  const pedirAyuda = async (instruccion) => {
    if (!texto.trim()) return;
    setCargando(true);
    setSugerencia('');

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texto: texto,
          instruccion: instruccion,
          modelo: modeloSeleccionado
        }),
      })

      if (!respuesta.ok) throw new Error(`Error: ${respuesta.status}`);
      const datos = await respuesta.json()
      setSugerencia(datos.respuesta_caliope)

    } catch (error) {
      console.error(error)
      setSugerencia("⚠️ Error de conexión con el servidor.")
    } finally {
      setCargando(false)
      setInputPersonalizado('')
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 text-slate-800 overflow-hidden font-sans">
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="w-full max-w-4xl h-full relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <textarea
            className="relative w-full h-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl p-8 text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none shadow-xl transition-all placeholder-slate-500"
            placeholder="Escribe tu historia aquí..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>

      <aside className="w-96 bg-white/40 backdrop-blur-2xl border-l border-white/30 p-6 flex flex-col gap-6 shadow-2xl z-10">
        <div className="text-center border-b border-teal-100 pb-4">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
            Calíope Dual
          </div>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Asistente IA</p>
        </div>

        <div>
          <label className="text-xs text-slate-600 uppercase tracking-wider mb-2 block font-semibold">Cerebro Activo:</label>
          <select
            className="w-full bg-white/80 border border-teal-200/50 rounded-lg p-3 text-sm text-teal-800 font-medium focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors cursor-pointer shadow-sm hover:bg-white"
            value={modeloSeleccionado}
            onChange={(e) => setModeloSeleccionado(e.target.value)}
            disabled={cargando}
          >
            <option value={MODELOS.OFICIAL}>🧠 Llama 3</option>
            <option value={MODELOS.CREATIVO}>✨ Hermes 2</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-wider mb-2 font-semibold">Pregunta Libre</p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-white/80 border border-teal-200/50 rounded-lg p-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors text-slate-700 shadow-sm placeholder-slate-400"
                placeholder="Ej: Describe el olor..."
                value={inputPersonalizado}
                onChange={(e) => setInputPersonalizado(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && pedirAyuda(inputPersonalizado)}
              />
              <button
                className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-teal-500/20"
                onClick={() => pedirAyuda(inputPersonalizado)}
                disabled={cargando}
              >
                ➤
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Atajos</p>
            <button className="flex items-center gap-3 w-full p-3 bg-white/60 hover:bg-teal-50 border border-white/50 hover:border-teal-200 rounded-lg transition-all text-sm text-slate-600 text-left group shadow-sm" onClick={() => pedirAyuda("Hazme una pregunta sobre la motivación del personaje.")} disabled={cargando}>
               <span className="text-lg group-hover:scale-110 transition-transform">🎭</span> Personaje
            </button>
            <button className="flex items-center gap-3 w-full p-3 bg-white/60 hover:bg-teal-50 border border-white/50 hover:border-teal-200 rounded-lg transition-all text-sm text-slate-600 text-left group shadow-sm" onClick={() => pedirAyuda("Hazme una pregunta sobre el ambiente.")} disabled={cargando}>
               <span className="text-lg group-hover:scale-110 transition-transform">🌫️</span> Atmósfera
            </button>
            <button className="flex items-center gap-3 w-full p-3 bg-white/60 hover:bg-teal-50 border border-white/50 hover:border-teal-200 rounded-lg transition-all text-sm text-slate-600 text-left group shadow-sm" onClick={() => pedirAyuda("Sugiere un giro inesperado.")} disabled={cargando}>
               <span className="text-lg group-hover:scale-110 transition-transform">⚡</span> Giro de Trama
            </button>
          </div>
        </div>

        {cargando && (
          <div className="text-center text-teal-600 animate-pulse text-sm mt-4 font-medium bg-teal-50/50 py-2 rounded-lg">
            Pensando... <br/>
            <span className="text-xs text-slate-400 font-normal">(Procesando en GPU local)</span>
          </div>
        )}

        {sugerencia && !cargando && (
          <div className="flex-1 overflow-y-auto mt-2 bg-gradient-to-b from-teal-50/80 to-blue-50/80 border border-teal-100 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-inner">
            <h3 className="text-xs font-bold text-teal-700 uppercase mb-2 tracking-wider flex items-center gap-2">
              <span>💡</span> Sugerencia:
            </h3>
            <div className="prose prose-sm prose-slate leading-relaxed">
              <ReactMarkdown>{sugerencia}</ReactMarkdown>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default App