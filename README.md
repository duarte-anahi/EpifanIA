# EpifanIA

**English** · [Español](README.es.md)

A writing assistant that runs large language models **entirely on your own computer**. No internet connection, no API keys, and your text never leaves your machine.

![EpifanIA editor](docs/editor.png)

> The interface is in Spanish.

## Features

- **Two models, two roles.** Switch between a precise *editor* (Llama 3.1, low temperature) and a creative *muse* (Hermes 3, high temperature) depending on what you need.
- **Stage-based help.** Brainstorm from a blank page, organize notes into a structure, or polish a finished draft.
- **Memory-aware model loading.** Only one model is kept in GPU memory at a time; switching models unloads the previous one to fit in 8 GB of VRAM.
- **Minimal editor.** A distraction-free writing surface with suggestions shown in a floating card.

## Tech stack

- **Backend:** Python, FastAPI, [llama-cpp-python](https://github.com/abetlen/llama-cpp-python) with CUDA
- **Frontend:** React, Vite, Tailwind CSS
- **Models:** GGUF format, 4-bit quantization (Q4_K_M)

## Project structure

```
backend/
  main.py              Model loading/unloading and generation endpoint
frontend/
  src/App.jsx          Editor, model selector and stage buttons
  src/SelectorPerfil.jsx   Profile selection screen
```

## Running locally

**Requirements:** an NVIDIA GPU with 8 GB of VRAM, Python 3.10+, Node.js 18+.

1. Install the backend:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   For GPU support, install `llama-cpp-python` with CUDA enabled — see its [installation guide](https://github.com/abetlen/llama-cpp-python#installation).

2. Download both models into the `backend/` folder:
   - `Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf` — [bartowski/Meta-Llama-3.1-8B-Instruct-GGUF](https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF)
   - `Hermes-3-Llama-3.1-8B.Q4_K_M.gguf` — [NousResearch/Hermes-3-Llama-3.1-8B-GGUF](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-8B-GGUF)
     → rename it to `Hermes-3-Llama-3.1-8B-Q4_K_M.gguf` (the name `main.py` expects)

3. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

4. Start the frontend (in a second terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Known limitations

- The student/teacher profile is selected in the interface but not yet used by the backend to adapt responses.
- Requires a dedicated NVIDIA GPU; there is no CPU fallback configured.

![Profile selection](docs/profile.png)
