exports.up = function(knex, Promise) {
  return knex.schema.createTable("user_table", tbl => {
    tbl.increments("user_id");

    tbl
      .string("firebase_id", 128)
      .notNullable()
      .unique();

    tbl
      .string("username", 128)
      .notNullable()
      .unique();

    tbl
      .string("email", 128)
      .unique()
      .notNullable();

    tbl.string("name", 128).notNullable();

    tbl.float("latitude");

    tbl.float("longitude");

    tbl.integer("lend_radius");

    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("user_table");
};
