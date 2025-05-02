# Etapa 1: Build do app com Node
FROM node:20.11.1 AS builder

WORKDIR /app

# Copia os arquivos necessários
COPY package*.json ./
COPY vite.config.* ./
COPY . .

# Instala as dependências e faz build do projeto
RUN npm install
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:stable-alpine

# Remove a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos para o ficheiro público do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia uma configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta usada pelo Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
