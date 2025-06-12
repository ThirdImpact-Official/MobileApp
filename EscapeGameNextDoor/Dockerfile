FROM node:20

RUN apt update && apt install -y \
  watchman \
  git \
  curl \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

RUN useradd -m appuser
USER appuser

WORKDIR /app

# Juste pour créer l'environnement de base
COPY --chown=appuser:appuser . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]
