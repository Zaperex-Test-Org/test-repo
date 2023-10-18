const knex = require("knex")({
  client: "better-sqlite3",
  connection: {
    filename: ":memory:",
  },
});
let request = {
  order: [
    {
      field: "1=1",
      order: "asc",
    },
  ],
};
let entitiesQuery = knex("final_entities").select("final_entities.*");

request?.order?.forEach(({ field }, index) => {
  const alias = `order_${index}`;
  entitiesQuery = entitiesQuery.leftOuterJoin(
    { [alias]: "search" },
    function search(inner) {
      inner
        .on(`${alias}.entity_id`, "final_entities.entity_id")
        .andOn(`${alias}.key`, knex.raw("?", [field]));
    }
  );
});

console.log(entitiesQuery.toString());
console.log(entitiesQuery.toSQL().toNative());

const userInput = "'; DROP TABLE users; --";
let badExample = knex.raw(
  `SELECT * FROM users WHERE username = '${userInput}'`
);
let goodExample = knex("users").whereRaw("username = ?", [userInput]);
console.log(badExample.toString());
console.log(badExample.toSQL().toNative());
console.log(goodExample.toString());
console.log(goodExample.toSQL().toNative());
