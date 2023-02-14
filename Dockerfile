#FROM node:10-alpine
FROM node:13

ENV POSTGRES_DB_ADDRESS '127.0.0.1'
ENV POSTGRES_DB_PORT 5432
ENV POSTGRES_DB_NAME postgres
ENV POSTGRES_DB_USER postgres
ENV POSTGRES_DB_PASSWORD admin

# Authorization
ENV AUTH_TOKEN secreto

# Paginación
ENV LIMIT_MAX 3000
ENV LIMIT_DEFAULT 3000

# Otros
ENV SERVER_PORT 5000
ENV NODE_ENV development

WORKDIR /app

# Copiar package.json y package-lock.json e instalar dependencias NPM
COPY package.json package-lock.json ./
RUN npm install

# Copiar código fuente
COPY . .

EXPOSE 5000

CMD npm start