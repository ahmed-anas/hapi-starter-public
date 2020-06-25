pipeline { 
    agent any
    stages { 
        stage('Stage 1 - Setup Environment ') {
            
            steps {
                git 'https://github.com/ahmed-anas/hapi-starter-public'
            }
        }
        stage('Stage 2 - Unit Tests') { 
            steps { 
                sh "docker-compose -f docker-compose.unit-test.yml up --exit-code-from unit-test --build"
            }
            
        }
    }
}