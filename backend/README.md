# User Database & Content Database

[Tutorial](https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/)

## Dependencies2

- [mongodb v4.0.6](https://docs.mongodb.com/manual/installation/)

- [node v10.15.2](https://nodejs.org/en/download/)

- npm v6.4.1 (installs with node)

## Ports

- User DB - 3001
- Content DB - 3002

### Node Dependencies

- Express

- BodyParser

- Mongoose

#### Setup

run inside directory 'backend/user-database' to install node dependencies. It will create a directory called 'node_modules'.

```bash
npm install
```

#### Run Server

```bash
node server.js 
```

If that fails with ```connection failed``` error
- have run MongoDB
- Options (from [mongodb website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)): 
```
Run MongoDB

From a terminal, issue the following to run MongoDB (i.e. the mongod process) in the foreground.
$ mongod --config /usr/local/etc/mongod.conf
# to stop 
CTRL + C

Alternatively, to run MongoDB as a macOS service, issue the following (the process uses the /usr/local/etc/mongod.conf file, created during the install):

$ brew services start mongodb-community@4.0
# to stop run
$ brew services stop mongodb-community@4.0
```

### AFS

module load node.js/10.14.1


### sign-up
expecting from frontend:
  firstName
  lastName
  email
  username
  password
