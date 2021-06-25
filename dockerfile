FROM node:lts-alpine
RUN apk add  --no-cache python g++ make
WORKDIR /sdc
COPY package.json package-lock.json ./
RUN npm install
COPY . .

CMD ["node", "server.js"]
