# ⚡ CodeForge — Next-Generation DSA & Socratic AI Coding Platform

[![CI Test Suite](https://github.com/VaishnavAron/CodeForge/actions/workflows/ci.yml/badge.svg)](https://github.com/VaishnavAron/CodeForge/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D.svg)](https://redis.io/)
[![Groq LPU](https://img.shields.io/badge/Groq-LPU%20Inference-F05A28.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**CodeForge** is an enterprise-grade, full-stack algorithmic problem-solving platform designed as a modern, high-performance alternative to LeetCode. Built with **React 19**, **Node.js/Express**, **Redis Cloud**, **MongoDB Atlas**, **Judge0 Sandbox**, and **Groq LPU Socratic AI inference**, CodeForge enables engineers to practice 103+ curated DSA challenges with sub-second feedback, real-time code execution, and guidance that never spoils the solution.

---

## 🏛️ High-Level Design (HLD)

### System Architecture Overview

```mermaid
flowchart TB
    subgraph ClientLayer ["Client Layer (Vercel / SPA)"]
        UI["React 19 + Vite + TailwindCSS"]
        Monaco["Monaco / CodeMirror Editor"]
        ReduxStore["Redux Toolkit (Auth & State)"]
        UI --> Monaco
        UI --> ReduxStore
    end

    subgraph Gateway ["Network & Security Layer"]
        CORS["CORS Preflight & Origin Whitelist"]
        CookieParser["HTTP-Only Cookie Authenticator"]
        CORS --> CookieParser
    end

    subgraph BackendCluster ["Application Layer (Render Web Service)"]
        Express["Express.js API Gateway"]
        AuthCtrl["User Auth & RBAC Controller"]
        ProblemCtrl["Problem Management Controller"]
        SubmitCtrl["Submission & Evaluation Controller"]
        AICtrl["Groq AI Mentor Controller"]

        Express --> AuthCtrl
        Express --> ProblemCtrl
        Express --> SubmitCtrl
        Express --> AICtrl
    end

    subgraph CacheCluster ["Caching & Rate Limiting"]
        Redis[(Redis Cloud Key-Value Store)]
        RateLimiter["Token Bucket Rate Limiter"]
        ProblemCache["getAllProblem Cache (Cache-Aside)"]
        Redis --> RateLimiter
        Redis --> ProblemCache
    end

    subgraph ExecutionCluster ["Code Execution Sandbox"]
        Judge0["Judge0 CE Isolated Sandbox API"]
        WorkerQueue["Batch / Single Submission Poller"]
        Judge0 --> WorkerQueue
    end

    subgraph AICluster ["LLM Inference Engine"]
        Groq["Groq LPU Inference (openai/gpt-oss-120b)"]
        PromptSanitizer["Socratic Prompt Guardrails"]
        Groq --> PromptSanitizer
    end

    subgraph DatabaseCluster ["Persistence Layer"]
        Atlas[(MongoDB Atlas Multi-Region Cluster)]
        PublicDNS["Google (8.8.8.8) / Cloudflare (1.1.1.1) DNS Fallback"]
        Atlas --> PublicDNS
    end

    ClientLayer --> Gateway
    Gateway --> BackendCluster
    BackendCluster --> CacheCluster
    SubmitCtrl --> ExecutionCluster
    AICtrl --> AICluster
    BackendCluster --> DatabaseCluster
```

### Architectural Design Decisions

1. **Decoupled Client & Server:** The client is an optimized static SPA hosted on Vercel's global Edge CDN, while the API is a stateless Express.js service hosted on Render with automatic horizontal scale capability.
2. **Asynchronous Execution Model:** Code compilation and execution are delegated to an isolated sandboxed worker engine (Judge0 CE). The backend signs the payload, submits to the queue, and polls the token status asynchronously, ensuring that long-running user scripts never block Express event loop threads.
3. **Sub-400ms Socratic AI Mentoring:** Integrated with Groq LPU inference to process the user's live code AST, language context, and problem statement with sub-second latency, providing contextual guidance rather than verbatim code leaks.
4. **Multi-Tier Cache & Failover:** Redis Cloud caches high-traffic read operations (`getAllProblem`), invalidating only on admin mutations. A built-in Node DNS resolver override (`dns.setServers`) prevents ISP SRV record drops on residential networks connecting to MongoDB Atlas.

---

## 🔬 Low-Level Design (LLD)

### 1. Database Schemas (MongoDB / Mongoose)

```mermaid
erDiagram
    USER ||--o{ SUBMISSION : creates
    USER }o--o{ PROBLEM : "solves"
    PROBLEM ||--o{ SUBMISSION : evaluated_for

    USER {
        ObjectId _id PK
        string firstName
        string lastName
        string emailId UK
        string password "bcrypt hash (10 rounds)"
        string role "user | admin"
        ObjectId[] problemSolved FK
        date createdAt
        date updatedAt
    }

    PROBLEM {
        ObjectId _id PK
        string title UK
        string description
        string difficulty "easy | medium | hard"
        string tags "array | dp | graph | concurrency"
        object starterCode "cpp, java, python, javascript"
        object[] testCases "input, output, isHidden"
        object driverCode "hidden harness per language"
        ObjectId createdBy FK
        date createdAt
    }

    SUBMISSION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId problemId FK
        string code
        string language "cpp | java | python | javascript"
        string status "Accepted | Wrong Answer | TLE | Compilation Error"
        number runtime "milliseconds"
        number memory "kilobytes"
        number testCasesPassed
        number totalTestCases
        date submittedAt
    }
```

### 2. End-to-End Submission & Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Engineer / Candidate
    participant FE as Frontend Workspace
    participant API as Express API Server
    participant Redis as Redis Cloud Cache
    participant Judge0 as Judge0 CE Sandbox
    participant DB as MongoDB Atlas

    User->>FE: Click "Run Code" / "Submit"
    FE->>API: POST /submission/submitCode { problemId, code, languageId }
    API->>Redis: Check Rate Limit (IP / User ID)
    alt Rate Limit Exceeded
        Redis-->>API: 429 Too Many Requests
        API-->>FE: Reject with Retry-After Header
    else Allowed
        API->>DB: Fetch Problem Hidden Driver Code & Test Cases
        API->>API: Wrap user code into execution harness
        API->>Judge0: POST /submissions { source_code, language_id, stdin }
        Judge0-->>API: Return token: "7b4c9e..."
        loop Poll Status (every 1s, max 10s)
            API->>Judge0: GET /submissions/7b4c9e?base64_encoded=true
            Judge0-->>API: Status: Processing | Done
        end
        API->>DB: Persist new Submission Record
        alt All Test Cases Passed
            API->>DB: Add problemId to User.problemSolved
        end
        API-->>FE: Return Verdict, Runtime, Memory & Testcase Diffs
        FE-->>User: Render Interactive Result & Confetti
    end
```

### 3. Socratic AI Mentor Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Engineer
    participant FE as Workspace Chat UI
    participant API as /ai/hint Endpoint
    participant Groq as Groq LPU (gpt-oss-120b)

    User->>FE: "I'm getting TLE on large arrays, what can I do?"
    FE->>API: POST /problem/askAI { code, questionTitle, problemDesc, prompt }
    API->>API: Sanitize input & inject Socratic Guardrail System Prompt
    Note over API: "Strict rule: NEVER provide code solution directly. Explain intuition, identify time complexity bottlenecks, ask guided questions."
    API->>Groq: Generate completion with temperature 0.3
    Groq-->>API: Socratic explanation & algorithmic hint
    API-->>FE: Streamed AI response
    FE-->>User: Markdown rendered hint with LaTeX bounds
```

---

## ✨ Features & Capabilities

- 🎯 **103+ Curated Algorithm Challenges:** Complete catalog across Arrays, Dynamic Programming, Trees, Graphs, and Concurrency.
- ⚡ **Groq LPU Socratic AI:** Sub-400ms AI mentor providing complexity analysis, bug diagnosis, and conceptual nudges without giving away answers.
- 🛡️ **Multi-Language Sandboxed Execution:** Run and evaluate C++, Java, Python, and JavaScript inside isolated Judge0 environments.
- 🔒 **Role-Based Access Control (RBAC):** Distinct permissions for `user` and `admin` accounts. Admins can create, update, and manage problems.
- 🚀 **Redis Accelerated Caching:** Sub-millisecond problem catalog lookups with cache-aside invalidation.
- 📱 **Fully Responsive Modern UI:** Glassmorphic design built with TailwindCSS, featuring Monaco Code Editor, bottom console drawer, and responsive navigation drawer.
- 💳 **Premium Experience Preview:** Interactive upgrade modal highlighting public beta benefits and future Stripe/Razorpay integration.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, DaisyUI, Monaco Editor, Framer Motion, Lucide Icons, Redux Toolkit, Axios |
| **Backend** | Node.js, Express.js, Mongoose, Redis Client, JSON Web Tokens (JWT), Bcrypt, Dotenv |
| **Databases & Cache** | MongoDB Atlas (NoSQL persistence), Redis Cloud (In-memory caching & rate limiting) |
| **Execution Sandbox**| Judge0 CE Sandbox Engine |
| **AI Inference** | Groq LPU Inference API (`openai/gpt-oss-120b`) |
| **Deployment** | Vercel (Frontend SPA), Render (Backend Web Service) |

---

## 🚀 Quickstart & Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/CodeForge.git
cd CodeForge
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in your `.env` variables:
```env
PORT=7000
DB_CONNECT_STRING=your_mongodb_atlas_connection_string
JWT_KEY=your_secure_random_jwt_secret
REDIS_PASS=your_redis_password
JUDGE0_URL=https://ce.judge0.com
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
# or: node src/index.js
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```
Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Production Deployment Guide

### Deploy Backend (Render)
1. Link your GitHub repository to [dashboard.render.com](https://dashboard.render.com/).
2. Create a **Web Service** with:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
3. Add your production environment variables (`DB_CONNECT_STRING`, `JWT_KEY`, `REDIS_PASS`, `JUDGE0_URL`, `GROQ_API_KEY`, `CLIENT_URL`, `NODE_ENV=production`).

### Deploy Frontend (Vercel)
1. Import your GitHub repository on [vercel.com](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `VITE_BACKEND_URL`: Your deployed Render backend URL (e.g. `https://codeforge-api.onrender.com`).
4. Click **Deploy**.

---

## 📄 License
This project is licensed under the MIT License — feel free to use, modify, and distribute for personal and commercial projects.
