pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "node-app"
        BUILD_TAG = "v${env.BUILD_NUMBER}"
    }

    stages {
        stage('Workspace Prep') {
            steps {
                echo 'Cleaning up workspace...'
                deleteDir()
                checkout scm
            }
        }

        stage('Testing (Gate 1)') {
            steps {
                dir('src') {
                    echo 'Installing dependencies and running tests...'
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Security (Gate 2)') {
            steps {
                echo 'Running Trivy Security Scan...'
                // Running Trivy via Docker container to avoid host dependencies
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${BUILD_TAG}"
            }
        }

        stage('Packaging') {
            steps {
                echo "Building Docker image ${DOCKER_IMAGE}:${BUILD_TAG}..."
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_TAG} -t ${DOCKER_IMAGE}:latest -f docker/Dockerfile ."
            }
        }

        stage('Deployment') {
            steps {
                echo 'Deploying application using Docker Compose...'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
