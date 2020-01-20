## Running Instruction
0) Please be aware of locally running PostgreSql service on port 5432.
1) Install Docker (https://docs.docker.com/engine/installation/) <br/>
2) Install Docker Compose (https://docs.docker.com/compose/install/) <br/>
3) **Start API:** <br/>
 3a) To start API with database run `docker-compose -f docker-compose-api.yaml up --force-recreate` <br/>
 3b) To stop API with database container run `docker-compose -f docker-compose-api.yaml down` <br/>
4) **Run tests:** <br/>
 4a) To run tests start db container first `docker-compose -f docker-compose-db.yaml up --force-recreate` <br/>
 4b) Then run `npm run test` (NodeJS 12.4.1 is necessary)<br/>
 4c) After test running stop db container `docker-compose -f docker-compose-api.yaml down` <br/>

 ## API

`POST api/v1/orders` - creates order <br/>
        `body: {items:[{id: integer, quantity: integer}]`, customerId: integer, address: text} <br/>
`GET api/v1/orders/:id` - gets order <br/>
`GET api/v1/orders` - get list of orders <br/>
`DELETE api/v1/orders/:id` - deletes order <br/>
`PATCH api/v1/orders/:id` <br/>
        `body: {items:[{id: integer, quantity: integer}]}` <br/>

`POST api/v1/orders/:id/preparation` - begin order preparation <br/>
`GET api/v1/orders/:id/preparation` - get order preparation details <br/>
`PATCH api/v1/orders/:id/preparation` - update order preparation <br/>
        `body: {completed: true}` <br/>

`POST api/v1/orders/:id/delivery` - begin order delivery <br/>
`GET api/v1/orders/:id/delivery` - get order delivery details <br/>
`PATCH api/v1/orders/:id/delivery` - update order delivery <br/>
        `body: {completed: true}` <br/>