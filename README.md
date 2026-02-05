EpifanIA: Asistente de Escritura Local

EpifanIA es una aplicación "Full Stack" que ejecuta Modelos de Lenguaje (LLMs) de manera local para asistir en procesos de escritura creativa y técnica.

El proyecto funciona  offline y garantiza la privacidad del usuario al ejecutarse sobre hardware local, optimizado para tarjetas gráficas NVIDIA RTX 4060.



Características Principales

Doble Modelo: Permite alternar entre modelos especializados en Lógica (Llama 3.1) y Creatividad (Hermes 3).

Gestión de Memoria: Implementa un sistema de carga y descarga de modelos para liberar VRAM dinámicamente.

Interfaz: Frontend desarrollado en React con Tailwind CSS, ofreciendo un editor minimalista.

Sin Filtros (Opcional): Soporte para modelos "Abliterated" que permiten la generación de ficción sin restricciones de contenido.

Stack Tecnológico

Backend: Python, FastAPI, Llama-cpp-python (con soporte CUDA).

Frontend: React, Vite, Tailwind CSS.

Modelos: Formato GGUF (Cuantización de 4 bits).

Instalación

1. Clonar el repositorio

git clone [https://github.com/TU_USUARIO/EpifanIA.git](https://github.com/TU_USUARIO/EpifanIA.git)
cd EpifanIA


2. Configurar Backend (Motor de IA)

python -m venv .venv
.venv\Scripts\activate
pip install fastapi uvicorn pydantic llama-cpp-python huggingface_hub


3. Descargar Modelos



4. Configurar Frontend (Interfaz)

cd frontend
npm install


Ejecución del Proyecto

El sistema requiere dos terminales activas simultáneamente:

Terminal 1 (Backend):

uvicorn main:app --reload


Terminal 2 (Frontend):

cd frontend
npm run dev


Proyecto creado con fines educativos y de desarrollo local.