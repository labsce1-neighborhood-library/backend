exports.up = function(knex, Promise) {
  return knex.schema.createTable("book_table", tbl => {
    tbl.increments("book_id");

    tbl
      .integer("user_id")
      .references("user_id")
      .inTable("user_table")
      .notNullable()
      .onDelete("cascade");

    tbl.string("isbn", 13).notNullable();

    tbl
      .enu("condition", ["excellent", "very good", "good", "okay", "poor"])
      .notNullable();

    tbl
      .boolean("loaned")
      .defaultTo(false)
      .notNullable();

    tbl.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {};
