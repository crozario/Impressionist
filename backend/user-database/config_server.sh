#!/bin/bash 

cd ~/Impressionist/
git pull
cp ~/Impressionist/backend/user-database/production.conf ~/Impressionist/backend/user-database/Dockerfile ~/Impressionist/backend/user-database/docker-compose.yml /docker/user-database
cd /docker/user-database 
sudo docker-compose up