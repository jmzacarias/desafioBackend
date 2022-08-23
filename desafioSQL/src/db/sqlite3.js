import knex from "knex";

const sqliteOptions = {
  client: "sqlite3",
  connection: { filename: "./sqliteDatabase.sqlite" },
  useNullAsDefault: true,
};
let db = knex(sqliteOptions);

try {
  let exists = await db.schema.hasTable("chat");
  if (exists) {
    console.log("Chat encontrado");
  } else {
    await db.schema.createTable("chat", (table) => {
      table.string("user");
      table.string("message");
      table.string("time");
    });
  }
} catch (error) {
  console.log(error);
}

export default db;