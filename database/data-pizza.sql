BEGIN;
INSERT INTO "PizzaStore"."PizzaType" (name) VALUES ('margarita'), ('marinara'), ('salami');
INSERT INTO "PizzaStore"."PizzaSize" (name) VALUES ('s'), ('m'), ('l');
INSERT INTO "PizzaStore"."Pizza" (typeId, sizeId) 
    SELECT pt.id, ps.id FROM "PizzaStore"."PizzaType" as pt, "PizzaStore"."PizzaSize" as ps 
        WHERE NOT EXISTS (SELECT id FROM "PizzaStore"."Pizza" as p WHERE p.typeId=pt.id AND p.sizeId=ps.id);
COMMIT;