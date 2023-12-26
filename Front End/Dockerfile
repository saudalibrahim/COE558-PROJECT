FROM node:18-alpine
WORKDIR /converter/
COPY public/ /converter/public
COPY src/ /converter/src
COPY package.json /converter/
RUN npm install
CMD ["npm", "start"]