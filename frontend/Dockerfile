# Stage di build: usa immagine base Debian compatibile
FROM node:18 as build

# Imposta la working directory
WORKDIR /app

# Copia i file package.json e lock
COPY package*.json ./

# Installa tutte le dipendenze (dev incluse, necessarie per vite)
RUN npm ci

# Copia tutto il codice sorgente
COPY . .

# Esegui la build di Vite
RUN npm run build

# Stage di produzione con Nginx
FROM nginx:alpine

# Copia i file statici buildati nella root di Nginx
COPY --from=build /app/dist /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html

# Copia configurazione personalizzata di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Esponi la porta (di default Nginx serve su 80)
EXPOSE 443

# Comando di avvio
CMD ["nginx", "-g", "daemon off;"]
