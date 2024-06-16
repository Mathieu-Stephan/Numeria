#!/bin/sh

BASE_PATH="/app/defis"

PORT=3012

start_containers() {
  for DIR in "$BASE_PATH"/*; do
    if [ -d "$DIR" ]; then
      IMAGE_NAME=$(basename "$DIR")
    
      if docker images | grep -q "$IMAGE_NAME"; then
        echo "L'image $IMAGE_NAME existe déjà, saut de la construction."
      else
        docker build -t "$IMAGE_NAME" "$DIR"
        BUILD_RESULT=$?
        if [ $BUILD_RESULT -ne 0 ]; then
          echo "Échec de la construction de l'image Docker pour $IMAGE_NAME"
          continue
        fi
      fi
    
      if docker ps -a --filter "name=$IMAGE_NAME" | grep -q "$IMAGE_NAME"; then
        if docker ps --filter "name=$IMAGE_NAME" | grep -q "$IMAGE_NAME"; then
          echo "Le conteneur $IMAGE_NAME est déjà en cours d'exécution, saut de l'exécution."
        else
          docker start "$IMAGE_NAME"
        fi
      else
        docker run -d -p $PORT:$PORT --name "$IMAGE_NAME" "$IMAGE_NAME"
        RUN_RESULT=$?
        if [ $RUN_RESULT -ne 0 ]; then
          echo "Échec du démarrage du conteneur Docker pour $IMAGE_NAME"
          continue
        fi
      fi

      PORT=$((PORT+1))
    else
      echo "$DIR n'est pas un répertoire."
    fi
  done
}

stop_containers() {
  for DIR in "$BASE_PATH"/*; do
    if [ -d "$DIR" ]; then
      IMAGE_NAME=$(basename "$DIR")

      if docker ps | grep -q "$IMAGE_NAME"; then
        echo "Arrêt du conteneur Docker pour $IMAGE_NAME"
        docker stop "$IMAGE_NAME"
      fi
    fi
  done
}

handle_signals() {
  echo "Signal reçu, arrêt des conteneurs..."
  stop_containers
  exit 0
}

trap stop_containers SIGTERM SIGINT

start_containers

sh -c "npm start & node server.js"

while true; do
  sleep 1
done