# Dependencies and Containerization

## Server Hosting

- Application Server -> http://ec2-18-223-101-151.us-east-2.compute.amazonaws.com:3000
- User Database Rest API -> http://ec2-3-82-150-208.compute-1.amazonaws.com:3001
- Content Database Rest API -> http://ec2-3-82-150-208.compute-1.amazonaws.com:3002


## Docker 

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo apt-get install docker-compose
```

### Application Server

```bash
docker build -t crozario/impressionist-application-server .

docker run -d -p 3000:3000 crozario/impressionist-application-server
```

### User Database

```bash
docker build -t crozario/impressionist-user-database-rest-api .

docker run -d -e "NODE_ENV=production" -p 3001:3001 crozario/impressionist-user-database-rest-api
```

### Content Database

```bash
docker build -t crozario/impressionist-content-database-rest-api .

docker run -d -e "NODE_ENV=production" -p 3002:3002 crozario/impressionist-content-database-rest-api

docker-compose up -d
```

**Useful Docker Commands**
- docker system prune -a (removes all images that are not running)
- docker ps (get running docker processes)
- docker logs <container id> (print output of application)
- docker run -d (-d -> detached mode, -e -> environment variable)
- docker kill $(docker ps -q) (stop all containers)
- docker rm $(docker ps -a -q) (remove all containers)
- docker rmi $(docker images -q) (remove all docker images)

https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md (running node with docker best practices)

### Installing Docker on Ubuntu Server
https://docs.docker.com/install/linux/docker-ce/ubuntu/

## Dependencies

- Docker
- nginx

### Application Server

- opensmile (https://www.audeering.com/download/opensmile-2-3-0-tar-gz/?wpdmdl=4782)
- build-essential
- g++
- gcc
- autotools-dev
- autoconf
- libtool
- python3
	- uwsgi 
	- eventlet
	- Flask
	- Flask-SocketIO
	- google-cloud-speech
	- scipy
	- urllib3
	- matplotlib

### User Database

### Content Database


## Security

### HTTPS

https://security.stackexchange.com/questions/5126/whats-the-difference-between-ssl-tls-and-https
https://expressjs.com/en/advanced/best-practice-security.html


https://letsencrypt.readthedocs.io/en/latest/using.html#running-with-docker

## Nginx

https://www.digitalocean.com/community/tutorials/understanding-nginx-server-and-location-block-selection-algorithms


