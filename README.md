# 🚀 Automated Node.js Jenkins Pipeline

[![Build Status](https://img.shields.io/badge/jenkins-pipeline-blue.svg)](http://localhost:8080)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Platform: Node.js](https://img.shields.io/badge/Platform-Node.js%2024-green.svg)](https://nodejs.org/)

A high-performance, production-ready Node.js application featuring a fully automated CI/CD pipeline, security gates, and a stunning real-time operational dashboard.

---

## ✨ Features

- **✨ Dual CI/CD Support**: Fully configured for both **Jenkins** (Jenkinsfile) and **GitHub Actions** (.github/workflows).
- **🎨 Stunning Operational Dashboard**: A modern, glassmorphic UI for real-time health monitoring and metrics visualization.
- **🏗️ Automated CI/CD**: Comprehensive `Jenkinsfile` including prep, testing, linting, packaging, security scanning, and verified deployment.
- **🐳 Dockerized Architecture**: Multi-stage production builds with non-root security and resource limits.
- **🛡️ Robust Security**: Integrated **Trivy** security scanning and **Helmet.js** protection.
- **📊 Observability**: Built-in **Prometheus** metrics, structured **Pino** logging, and request tracing.
- **⚡ Dynamic Port Support**: Intelligent port allocation to allow multiple instances on a single host.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js 24 (Alpine Linux)
- **Framework**: Express.js
- **UI**: Vanilla HTML5/CSS3 (Glassmorphism)
- **Security**: Helmet, Trivy
- **Testing**: Mocha, Chai, Supertest
- **Artifacts**: JUnit Test Reports
- **Containerization**: Docker & Docker Compose

---

## 🚦 Quick Start

### 1. Run with Docker Compose (Recommended)
```bash
APP_PORT=3005 docker-compose up --build -d
```

### 2. Access the Application
- **Dashboard**: [http://localhost:3005](http://localhost:3005)
- **API Health**: [http://localhost:3005/healthz](http://localhost:3005/healthz)
- **Metrics**: [http://localhost:3005/metrics](http://localhost:3005/metrics)

---

## 📂 Project Structure

```text
├── src/
│   ├── public/         # Dashboard UI (HTML, CSS, JS)
│   ├── index.js        # Main Express Server
│   ├── test.js         # Integration Tests
│   └── package.json    # Project Manifest
├── docker/
│   └── Dockerfile      # Multi-stage Production Build
├── Jenkinsfile         # 7-stage CI/CD Pipeline Definition
└── docker-compose.yml  # Local Orchestration
```

---

## 🏗️ Jenkins Pipeline Stages

1. **Workspace Prep**: Environment cleaning and source checkout.
2. **Testing (Gate 1)**: Automated testing with JUnit report generation.
3. **Linting**: Code style verification via ESLint.
4. **Packaging**: Docker image building and tagging.
5. **Security (Gate 2)**: Trivy container vulnerability scanning.
6. **Deployment**: Automated delivery via Docker Compose.
7. **Verification**: Post-deployment health-check with auto-rollback/reporting.
