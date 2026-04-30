<div align="center">

# SubSync

**Track every subscription. Never get surprised by a charge again.**

![Java](https://img.shields.io/badge/Java-21+-orange?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

</div>

---

SubSync is a modern full-stack application for managing recurring subscriptions. Add your services, track billing cycles, and keep everything in one clean dashboard — no more forgotten trials or unexpected charges at the end of the month.

---

## Quick Start

> **Requires:** Java 21+ · Node.js 20+ · Maven 3.6+

### 1. Clone & Setup
```bash
git clone https://github.com/Rayhan-Arrazy/subsync.git
cd subsync
```

### 2. Backend (Spring Boot)
Open `backend/src/main/resources/application.yml` and configure your PostgreSQL:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://your-db-url
    username: your-user
    password: your-password
```

Run the API:
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend (React + Shadcn)
```bash
cd frontend
npm install
npm run dev
```

Visit → `http://localhost:5173` (Frontend) & `http://localhost:8081` (API)

---

## Stack

| | |
|---|---|
| Backend | Java 21 · Spring Boot · PostgreSQL |
| Frontend | React 19 · Shadcn/UI · Tailwind v4 |
| Tooling | Maven · Vite · Lucide Icons |

---

## Structure

```
subsync/
├── backend/               # Spring Boot Application
│   └── src/main/java/     # API Controllers, Models, Repositories
└── frontend/              # Vite + React Application
    └── src/components/    # Shadcn components & Custom UI
```

---

<div align="center">

Made with React & Spring Boot · MIT License

</div>
