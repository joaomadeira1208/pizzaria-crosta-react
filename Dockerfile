# Etapa 1: Build do front
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa 2: Servir com NGINX
FROM nginx:stable-alpine

# Remove o index padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos do Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config personalizada do nginx (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]