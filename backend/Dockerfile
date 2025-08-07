# backend/Dockerfile

# Usa Node.js 18 Alpine come base
FROM node:18-alpine

# Installa curl per health checks
RUN apk add --no-cache curl

# Crea directory app
WORKDIR /app

# Crea utente non-root per sicurezza
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copia package.json e package-lock.json
COPY package*.json ./

# Installa dipendenze
RUN npm ci --only=production && npm cache clean --force

# Copia il resto del codice
COPY . .

# Cambia ownership dei file
RUN chown -R nextjs:nodejs /app
USER nextjs

# Esponi porta 5000
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Comando per avviare l'app
CMD ["npm", "start"]