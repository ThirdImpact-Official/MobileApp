FROM node:20

# Dépendances pour Expo
RUN apt update && apt install -y \
  watchman \
  git \
  curl \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ports nécessaires
EXPOSE 8081 19000 19001 19002

# Laisse le volume gérer le code + node_modules
CMD ["sh", "-c", "npm install && npx expo start --tunnel"]
