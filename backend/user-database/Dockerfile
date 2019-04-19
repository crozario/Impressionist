# User Database Server Dockerfile 

FROM node:10

LABEL maintainer="Crossley Rozario <crozariodev@gmail.com"

RUN apt-get update && \
	apt-get -y install build-essential && \
	apt-get -y install openssl

RUN mkdir -p dh-param && openssl dhparam -out ./dh-param/dhparam-2048.pem 2048

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]