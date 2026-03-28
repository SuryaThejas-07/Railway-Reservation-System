pipeline { 
    agent any 
 
    environment { 
        DOCKER_USERNAME = "suryathejas" 
        IMAGE_NAME = "railway-kuber" 
        IMAGE_TAG = "latest"
        DOCKER_PATH = "\"C:\\ProgramFiles\\Docker\\Docker\\resources\\bin\\docker.exe\"" 
    } 
 
    stages { 
 
        stage('Checkout Code') { 
            steps { 
                git branch: 'main', 
                url: 'https://github.com/SuryaThejas-07/Railway-Reservation-System.git' 
            } 
        } 
 
        stage('Verify Docker') { 
            steps { 
                bat '%DOCKER_PATH% --version' 
                bat '%DOCKER_PATH% info' 
            } 
        } 
 
        stage('Build Docker Image') { 
            steps { 
                bat '''
                %DOCKER_PATH% build -t %DOCKER_USERNAME%/%IMAGE_NAME%:%IMAGE_TAG% .
                ''' 
            } 
        } 
 
        stage('List Images (Debug)') { 
            steps { 
                bat '%DOCKER_PATH% images' 
            } 
        } 
 
        stage('Login to DockerHub') { 
            steps { 
                withCredentials([usernamePassword( 
                    credentialsId: 'docker-kuber',  
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS' 
                )]) { 
                    bat '''
                    %DOCKER_PATH% logout
                    echo %DOCKER_PASS% | %DOCKER_PATH% login -u %DOCKER_USER% --password-stdin
                    ''' 
                } 
            } 
        } 
 
        stage('Push Image') { 
            steps { 
                retry(3) { 
                    bat '''
                    %DOCKER_PATH% push %DOCKER_USERNAME%/%IMAGE_NAME%:%IMAGE_TAG%
                    ''' 
                } 
            } 
        } 
    } 
 
    post { 
        success { 
            echo 'Image railway-kuber built and pushed successfully!' 
        } 
        failure { 
            echo 'Pipeline failed. Check logs (Docker/network/credentials issue).' 
        } 
    }
}
