# Priority-Aware Elevator (SCAN) Disk Scheduler with Burst-Throttling

## Project Description

This project implements an enhanced **SCAN disk scheduling algorithm** that considers the priority of disk requests and uses **burst-throttling** to reduce prolonged waiting of lower-priority requests. The system compares Standard SCAN with the proposed algorithm using **cumulative head movement, estimated waiting time, seek distance, and heuristic starvation risk**.

The project is implemented as a **frontend-based simulation without request arrival-time modeling or a backend**, allowing users to visualize disk-head movement and compare scheduling performance interactively.

## Important Note

> Waiting time is estimated based on cumulative disk-head movement rather than actual request arrival and completion times. Starvation risk is evaluated using a heuristic based on prolonged waiting and priority levels. The system does not model dynamic request arrivals and does not require a backend.

## Run Locally

The frontend application and its Vite configuration live in `frontend/`. The SCAN scheduling algorithms are implemented in C++ and compiled to WebAssembly for the browser. Install [Emscripten](https://emscripten.org/docs/getting_started/downloads.html) and Node.js, then from the project root install dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The `dev` and `build` scripts compile `src/cpp/disk_scheduler.cpp` to a Vite-imported module in `src/generated/` and the WebAssembly binary in `public/` before starting/building the website. The React interface stays the same; its TypeScript simulation layer calls the compiled module.

Open the local URL printed in the terminal, usually `http://localhost:5173`.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project Structure

```text
frontend/
  index.html
  public/       Static files
  src/
    algorithms/ TypeScript bridge to the compiled scheduler
    components/ React UI components
    cpp/        C++ disk scheduling algorithms
    generated/  Generated WebAssembly module bindings
    utils/      Simulation and validation helpers
    types/      TypeScript types
  package.json
  package-lock.json
  vite.config.ts
  tsconfig*.json
  .oxlintrc.json
README.md
```

## Tech Stack

- React
- TypeScript
- C++ compiled to WebAssembly with Emscripten
- Vite
- Tailwind CSS
- Recharts
