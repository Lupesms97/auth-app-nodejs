# Etapa 1: Construir a aplicação TypeScript
FROM node:14 AS builder

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos necessários para instalar as dependências
COPY package*.json tsconfig.json ./

# Instalar as dependências do projeto
RUN npm install --quiet

# Copiar o restante do código-fonte
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Etapa 2: Criar a imagem mínima para a aplicação em produção
FROM node:14-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar os arquivos necessários, incluindo a aplicação construída, da etapa anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Instalar apenas as dependências de produção
RUN npm install --only=production --quiet

# Expor a porta em que o servidor Express está ouvindo
EXPOSE 8080

# Comando para iniciar a aplicação quando o contêiner for iniciado
CMD ["node", "./dist/app.js"]