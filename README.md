# AlgoQuiz

AlgoQuiz is a full-stack web application designed to help users learn and practice algorithms through interactive quizzes. The project consists of a React-based frontend and a FastAPI-based backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Features

- Create, read, update, and delete algorithms
- Generate quizzes based on algorithms
- Interactive quiz interface
- Tag-based algorithm categorization
- Responsive design

## Tech Stack

### Frontend (app)
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Axios
- Framer Motion

### Backend (server)
- FastAPI
- SQLAlchemy
- Pydantic
- Ollama (for quiz generation)

## Project Structure
    project-root/
    │
    ├── app/ # Frontend application
    │ ├── public/
    │ ├── src/
    │ │ ├── components/
    │ │ ├── hooks/
    │ │ ├── lib/
    │ │ ├── pages/
    │ │ ├── types/
    │ │ ├── usecases/
    │ │ └── ...
    │ ├── package.json
    │ └── ...
    │
    └── server/ # Backend application
    ├── app/
    │ ├── api/
    │ ├── core/
    │ ├── db/
    │ ├── models/
    │ ├── repositories/
    │ ├── schemas/
    │ ├── use_cases/
    │ └── ...
    ├── requirements.txt
    └── ...

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- pip (Python package manager)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/scmntc/alg-quiz-llm.git
   cd alg-quiz-llm
   ```

2. Set up the frontend:
   ```
   cd app
   npm install
   ```

3. Set up the backend:
   ```
   cd ../server
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the backend server:
   ```
   cd server
   uvicorn app.main:app --reload
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd app
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## API Documentation

Once the backend server is running, you can access the API documentation at `http://localhost:8000/docs`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

