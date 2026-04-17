# How to Run: Automated Node.js Jenkins Pipeline

This guide explains how to get the application up and running in different environments.

## 📋 Prerequisites

- **Node.js** (v24 or later)
- **Docker** & **Docker Compose**
- **Jenkins** (if you want to run the full CI/CD pipeline)

---

## 🚀 1. Local Development (NPM)

To run the application directly on your machine:

1. **Navigate to the source directory**:
   ```bash
   cd src
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your environment**:
   Copy the example environment file:
   ```bash
   cp ../.env.example .env
   ```

4. **Start the application**:
   ```bash
   npm start
   ```
   The server will be running at [http://localhost:3000](http://localhost:3000).

---

## 🐳 2. Running with Docker Compose

This is the recommended way to run the application as it mirrors the production setup.

1. **Build and start the containers**:
   ```bash
   APP_PORT=3000 docker-compose up --build -d
   ```

2. **Verify it's running**:
   - **Operational Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **JSON API**: [http://localhost:3000/api](http://localhost:3000/api)
   - **Health Check**: [http://localhost:3000/healthz](http://localhost:3000/healthz)
   - **Prometheus Metrics**: [http://localhost:3000/metrics](http://localhost:3000/metrics)

3. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop the containers**:
   ```bash
   docker-compose down
   ```

---

## 🧪 3. Quality Control (Tests & Linting)

### 🖥️ Local (via NPM)
```bash
cd src
npm test          # Run Integration Tests
npm run lint      # Run ESLint style checks
```

### 🐳 Docker (via Build Stage)
The `Dockerfile` is optimized to run tests during the build process if defined in the `Jenkinsfile`.

---

## 🏗️ 4. Jenkins Pipeline Setup

To automate this with Jenkins:

1. Create a new **Pipeline** job in Jenkins.
2. In the **Pipeline** section, select **Pipeline script from SCM**.
3. Point it to your repository URL.
4. Set the **Script Path** to `Jenkinsfile`.
5. Ensure your Jenkins worker has **Docker** installed and permissions to access `/var/run/docker.sock`.

---

## 📊 5. Observability

- **Metrics**: Access `http://localhost:3000/metrics` to see Prometheus formatted metrics.
* **Logging**: All logs are output in JSON format (via Pino). Use `pino-pretty` locally for readable output:
  ```bash
  npm start | npx pino-pretty
  ```
- **Tracing**: Every request includes an `X-Request-Id` in the response header for cross-referencing logs.
