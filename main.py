from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from llama_cpp import Llama
from pydantic import BaseModel
import gc
import os

# --- CONFIGURACIÓN DE NOMBRES ---
MODELO_OFICIAL = "Oficial (Educado)"
MODELO_CREATIVO = "Creativo (Hermes)"

# --- RUTAS EXACTAS (CORREGIDAS SEGÚN TU CARPETA) ---
RUTAS_MODELOS = {
    # Actualizado a Llama 3.1
    MODELO_OFICIAL: "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
    # Actualizado a Hermes 3
    MODELO_CREATIVO: "Hermes-3-Llama-3.1-8B-Q4_K_M.gguf"
}

PROMPTS_SISTEMA = {
    MODELO_OFICIAL: "Eres una editora literaria técnica. Responde directo, sin saludos, en un breve párrafo.",
    MODELO_CREATIVO: "Eres una musa filosófica. Sé sugerente, desafía la lógica pero sin perder la coherencia, no expliques, solo lanza la idea."
}

# --- MOTOR DE INFERENCIA ---
class MotorIA:
    def __init__(self):
        self.llm = None
        self.nombre_modelo_cargado = None

    def cargar(self, nombre_modelo: str):
        # Si el frontend manda un nombre que no conocemos, usamos el oficial por seguridad
        if nombre_modelo not in RUTAS_MODELOS:
            print(f"⚠️ Modelo '{nombre_modelo}' no reconocido. Usando oficial.")
            nombre_modelo = MODELO_OFICIAL

        # Si ya está cargado, no hacer nada (ahorra 5 segundos)
        if self.llm is not None and self.nombre_modelo_cargado == nombre_modelo:
            return

        archivo = RUTAS_MODELOS[nombre_modelo]

        # Validación de que el archivo realmente existe en el disco
        if not os.path.exists(archivo):
             print(f"❌ ERROR CRÍTICO: No encuentro el archivo '{archivo}'")
             print(f"   (Buscando en: {os.getcwd()})")
             raise HTTPException(status_code=500, detail=f"Falta archivo .gguf: {archivo}")

        print(f"♻️  CARGANDO CEREBRO: {nombre_modelo} ({archivo})...")

        # Limpieza de memoria VRAM anterior (Vital para 8GB)
        if self.llm:
            del self.llm
            gc.collect()

        try:
            # Carga en GPU (n_gpu_layers=-1 usa tu RTX 4060 al máximo)
            self.llm = Llama(
                model_path=archivo,
                n_gpu_layers=-1,
                n_ctx=4096,
                verbose=False
            )
            self.nombre_modelo_cargado = nombre_modelo
            print(f"✅ MOTOR LISTO: {nombre_modelo}")
        except Exception as e:
            print(f"❌ Error cargando Llama: {e}")
            raise HTTPException(status_code=500, detail="Fallo al cargar modelo en GPU")

    def generar_respuesta(self, mensajes, temperatura):
        return self.llm.create_chat_completion(
            messages=mensajes, temperature=temperatura, max_tokens=300
        )["choices"][0]["message"]["content"]

# Instancia global
motor = MotorIA()
app = FastAPI()

# Permisos para que el Frontend hable con el Backend
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

class PeticionCaliope(BaseModel):
    texto: str
    instruccion: str
    modelo: str = MODELO_OFICIAL

@app.post("/generar-pregunta")
def endpoint_generar(datos: PeticionCaliope):
    # 1. Cargar el modelo correcto
    motor.cargar(datos.modelo)

    # 2. Preparar el prompt
    system_prompt = PROMPTS_SISTEMA.get(datos.modelo, PROMPTS_SISTEMA[MODELO_OFICIAL])
    mensajes = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"TEXTO: {datos.texto}\n\nTAREA: {datos.instruccion}"}
    ]

    # 3. Ajustar creatividad
    temp = 0.8 if datos.modelo == MODELO_CREATIVO else 0.4
    
    # 4. Generar
    texto_generado = motor.generar_respuesta(mensajes, temp)

    print(f"\n🤖 {datos.modelo} dice: {texto_generado}\n")
    return {"respuesta_caliope": texto_generado}