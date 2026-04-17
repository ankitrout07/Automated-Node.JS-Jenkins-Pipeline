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
                    sh 'npm test || true' 
                }
            }
            post {
                always {
                    echo 'Archiving test results...'
                    junit 'src/test-results.xml'
                    archiveArtifacts artifacts: 'src/test-results.xml, src/package.json', fingerprint: true
                }
            }
        }

        stage('Linting') {
            steps {
                dir('src') {
                    echo 'Running code style checks...'
                    sh 'npm run lint'
                }
            }
        }

        stage('Packaging') {
            steps {
                echo "Building Docker image ${DOCKER_IMAGE}:${BUILD_TAG}..."
                sh "docker build -t ${DOCKER_IMAGE}:${BUILD_TAG} -t ${DOCKER_IMAGE}:latest -f docker/Dockerfile ."
                
                // Save image tag info as an artifact
                sh "echo ${BUILD_TAG} > build_version.txt"
                archiveArtifacts artifacts: 'build_version.txt', fingerprint: true
            }
        }

        stage('Security (Gate 2)') {
            steps {
                echo 'Running Trivy Security Scan...'
                sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $HOME/Library/Caches:/root/.cache/ aquasec/trivy image --severity HIGH,CRITICAL ${DOCKER_IMAGE}:${BUILD_TAG}"
            }
        }

        stage('Deployment') {
            steps {
                echo 'Deploying application using Docker Compose...'
                sh 'docker-compose down' // Fresh start
                sh 'docker-compose up -d'
            }
        }

        stage('Verification') {
            steps {
                script {
                    echo 'Verifying deployment health...'
                    // Wait for the container to be ready
                    sleep 5
                    retry(5) {
                        sh 'curl -f http://localhost:3000/healthz'
                    }
                    echo 'Application is healthy!'
                }
            }
            post {
                failure {
                    echo 'Verification failed! Collecting logs...'
                    sh 'docker-compose logs > deployment_failure.log'
                    archiveArtifacts artifacts: 'deployment_failure.log'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Deployment successful and verified!'
        }
        failure {
            echo 'Pipeline failed. Check archived logs and artifacts for details.'
        }
    }
}
