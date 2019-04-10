# Dependencies and Containerization

## Docker 

### User Database
 
docker build -t crozario/impressionist-user-database-rest-api .
docker run -p 3001:3001 crozario/impressionist-user-database-rest-api

### Content Database
docker build -t crozario/impressionist-content-database-rest-api .
docker run -p 3002:3002 crozario/impressionist-content-database-rest-api

**Useful Docker Commands**
- docker system prune -a (removes everything from docker)
- docker ps (get running docker processes)
- docker logs <container id> (print output of application)


## Dependencies

- Docker
