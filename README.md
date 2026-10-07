# Priority-Aware Elevator (SCAN) Disk Scheduler with Burst-Throttling

## Project Description

This project implements an enhanced **SCAN disk scheduling algorithm** that considers the priority of disk requests and uses **burst-throttling** to reduce prolonged waiting of lower-priority requests. The system compares Standard SCAN with the proposed algorithm using **cumulative head movement, estimated waiting time, seek distance, and heuristic starvation risk**.

The project is implemented as a **frontend-based simulation without request arrival-time modeling or a backend**, allowing users to visualize disk-head movement and compare scheduling performance interactively.

## Important Note

> Waiting time is estimated based on cumulative disk-head movement rather than actual request arrival and completion times. Starvation risk is evaluated using a heuristic based on prolonged waiting and priority levels. The system does not model dynamic request arrivals and does not require a backend.

## Run Locally

The frontend application and its Vite configuration live in `frontend/`. From the project root, install dependencies and start the development server with:

```bash
cd frontend
npm install
npm run dev
```

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
    algorithms/ Disk scheduling algorithms
    components/ React UI components
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
- Vite
- Tailwind CSS
- Recharts
