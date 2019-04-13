# Dependencies and Containerization

## Server Hosting

- Application Server -> ???
- User Database Rest API -> http://ec2-54-202-153-164.us-west-2.compute.amazonaws.com:3001
- Content Database Rest API -> http://ec2-54-202-153-164.us-west-2.compute.amazonaws.com:3002


## Docker 

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


### Application Server
docker build -t crozario/impressionist-application-server .
docker run -d -p 3000:3000 crozario/impressionist-application-server

### User Database
 
docker build -t crozario/impressionist-user-database-rest-api .
docker run -d -e "NODE_ENV=production" -p 3001:3001 crozario/impressionist-user-database-rest-api

### Content Database
docker build -t crozario/impressionist-content-database-rest-api .
docker run -d -e "NODE_ENV=production" -p 3002:3002 crozario/impressionist-content-database-rest-api

**Useful Docker Commands**
- docker system prune -a (removes everything from docker)
- docker ps (get running docker processes)
- docker logs <container id> (print output of application)
- docker run -d (-d -> detached mode, -e -> environment variable)

https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md (running node with docker best practices)

### Installing Docker on Ubuntu Server
https://docs.docker.com/install/linux/docker-ce/ubuntu/

## Dependencies

- Docker
- opensmile (https://www.audeering.com/download/opensmile-2-3-0-tar-gz/?wpdmdl=4782)
