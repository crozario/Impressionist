FROM node:10

LABEL maintainer="Crossley Rozario <crozariodev@gmail.com"

RUN apt-get update && \
	apt-get -y installbuild-essential && \
	apt-get -y install python3 && \
	apt-get -y install python3-dev && \
    apt-get -y install python3-pip && \
    apt-get -y install nginx

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ]
