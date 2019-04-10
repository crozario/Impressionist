FROM node:10

RUN apt-get update && apt-get install -y build-essential && apt-get install -y python

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install
# If you are building your code for production
RUN npm ci --only=production

COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]
