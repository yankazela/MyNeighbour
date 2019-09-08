pipeline {
    agent {
        docker {
            image 'node:6-alpine' 
            args '-p 3010:3010' 
        }
    }
    stages {
        stage('Build') { 
            steps {
                sh 'npm install' 
            }
        }
    }
}