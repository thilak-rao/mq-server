# MQ
A side project that is currently underway. Uses Hapi, TypeScript and Neo4j graph db. 

**Installation**

* `npm install` (Install node modules)
* `typings install` (Install type definitions)

**Dependencies**

* node `v4.5.x`
* neo4j `v3.0.x`

**Run**

* `gulp build` - Build TS files
* `gulp test` - Run Hapi Lap Tests
* `gulp tslint` - Run tslint
* `gulp watch` - watch server source files and compile js. 
* `gulp start` - Run nodemon which restarts on file change
* `gulp webpack:devserver` - Serve and watch frontend files

** Environment Variables **
* `AWSAccessKeyId` - AWS Access Key
* `AWSSecretKey` - AWS Secret Key
* `Neo4jUser` - Neo4j username
* `Neo4jPwd` - Neo4j Password

For more fine tuning, have a look at `./src/configs/environment.ts`

**API Documentation**

MQ uses Swagger for API documentation - localhost:3000/documentation


