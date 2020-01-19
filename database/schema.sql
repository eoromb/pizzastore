BEGIN;
CREATE SCHEMA "PizzaStore" AUTHORIZATION postgres;
CREATE TYPE "PizzaStore"."OrderStatusType" AS ENUM (
  'new',
  'preparing',
  'prepared',
  'delivering',
  'delivered'
);
CREATE TABLE "PizzaStore"."PizzaType" (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE "PizzaStore"."PizzaSize" (
  id SERIAL PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE "PizzaStore"."Pizza" (
  id SERIAL PRIMARY KEY,
  typeId integer REFERENCES "PizzaStore"."PizzaType"(id) ON DELETE CASCADE,
  sizeId integer REFERENCES "PizzaStore"."PizzaSize"(id) ON DELETE CASCADE,
  UNIQUE(typeId, sizeId)
);
CREATE TABLE "PizzaStore"."Customer" (
  id SERIAL PRIMARY KEY,
  name text NOT NULL CHECK(length(name) > 0),
  address text
);
CREATE TABLE "PizzaStore"."Order" (
  id SERIAL PRIMARY KEY,
  status "PizzaStore"."OrderStatusType" DEFAULT 'new' NOT NULL,
  version integer DEFAULT 1 NOT NULL,
  customerId integer REFERENCES "PizzaStore"."Customer"(id) ON DELETE CASCADE,
  address text NOT NULL
);
CREATE TABLE "PizzaStore"."OrderItem" (
  id SERIAL PRIMARY KEY,
  orderId integer REFERENCES "PizzaStore"."Order"(id) ON DELETE CASCADE,
  pizzaId integer REFERENCES "PizzaStore"."Pizza"(id) ON DELETE CASCADE,
  quantity integer CHECK(quantity > 0),
  UNIQUE(orderId, pizzaId)
);
CREATE TABLE "PizzaStore"."Preparation" (
  id SERIAL PRIMARY KEY,
  orderId integer REFERENCES "PizzaStore"."Order"(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  UNIQUE (orderId)
);
CREATE TABLE "PizzaStore"."Delivery" (
  id SERIAL PRIMARY KEY,
  orderId integer REFERENCES "PizzaStore"."Order"(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  UNIQUE (orderId)
);
CREATE INDEX IF NOT EXISTS indOrderStatus on "PizzaStore"."Order" (status);
CREATE INDEX IF NOT EXISTS indOrderCustomer on "PizzaStore"."Order" (customerId);
COMMIT;