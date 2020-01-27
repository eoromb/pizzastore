# Simple implementation of pizza ordering service

## Description

Imagine a pizza ordering services with the following functionality:

1. Order a pizza.

   - Specify the desired pizza type (margarita, marinara, salami), the number of pizza items and their size (small, medium, large).  
   Example: 1 x Salami small, 2 x Marinara large, 1 x Salami medium
   - An order should contain information about the customer: name, address.
   - It should be possible to track the status of order delivery. (new, preparing, delivering, delivered)

2. Update an order.

   - There should be a possibility to update the order details (pizzas/number of pizzas/size).
   - There should be a possibility to change the status of order delivery.  
  Please, pay attention, that order in some delivery statuses (e.g. delivered) could not be updated.

3. Remove an order.

4. Retrieve an order.

5. List orders.

   - Provide filtering by status/customer.

## Backend Tasks, Node.js

1. Design Model/DB structure (PostgreSQL).
2. Design and implement Rest API with Express Framework for the described web service.
3. Implement unittest(s) at least for one of the endpoints.
4. Setup a docker environment for the solution (including database)
   Notes:
5. Take care about proper input validation approach and global error handling.
6. Keep your endpoints as RESTful as possible.
7. You don't have to take care of authentication etc, we are just interested in code structure and data modelling;

## Running Instruction

1. Please be aware of locally running PostgreSql service on port 5432.
2. Install Docker (https://docs.docker.com/engine/installation/)  
3. Install Docker Compose (https://docs.docker.com/compose/install/)  
4. **Start API:**
   1. To start API with database run `docker-compose -f docker-compose-api.yaml up --force-recreate`  
   2. To stop API with database container run `docker-compose -f docker-compose-api.yaml down`  
5. **Run tests:**
   1. To run tests start db container first `docker-compose -f docker-compose-db.yaml up --force-recreate`
   2. Then run `npm run test` (NodeJS 12.4.1 is necessary)
   3. After test running stop db container `docker-compose -f docker-compose-api.yaml down`

## API

1. `POST api/v1/orders` - creates order
   - `body: {items:[{id: integer, quantity: integer}]`, customerId: integer, address: text}
2. `GET api/v1/orders/:id` - gets order
3. `GET api/v1/orders` - get list of orders
4. `DELETE api/v1/orders/:id` - deletes order
5. `PATCH api/v1/orders/:id`
6. `body: {items:[{id: integer, quantity: integer}]}`
7. `POST api/v1/orders/:id/preparation` - begin order preparation
8. `GET api/v1/orders/:id/preparation` - get order preparation details
9. `PATCH api/v1/orders/:id/preparation` - update order preparation
   - `body: {completed: true}`
10. `POST api/v1/orders/:id/delivery` - begin order delivery
11. `GET api/v1/orders/:id/delivery` - get order delivery details
12. `PATCH api/v1/orders/:id/delivery` - update order delivery details
