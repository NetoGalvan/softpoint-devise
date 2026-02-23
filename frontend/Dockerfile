# ==========================================
# Stage 1: Development
# Para desarrollo local con hot-reload
# ==========================================
FROM node:20-alpine AS development

# Instalar dependencias del sistema (opcional pero recomendado)
RUN apk add --no-cache git

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de package
COPY package*.json ./

# Limpiar caché de npm y reinstalar
RUN npm cache clean --force && \
    npm install

# Copiar código fuente
COPY . .

# Copiar .env explícitamente
COPY .env .env

# Exponer puerto de Vite
EXPOSE 5173

# Comando de desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ==========================================
# Stage 2: Build para Producción
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de package
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# ==========================================
# Stage 3: Production con Nginx
# ==========================================
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]