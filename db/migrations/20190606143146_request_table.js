exports.up = function(knex, Promise) {
  return knex.schema.createTable("request_table", tbl => {
    tbl.increments("request_id");

    tbl
      .integer("loaner")
      .references("user_id")
      .inTable("user_table")
      .notNullable()
      .onDelete("cascade");

    tbl
      .integer("borrower")
      .references("user_id")
      .inTable("user_table")
      .notNullable()
      .onDelete("cascade");

    tbl
      .integer("book")
      .references("book_id")
      .inTable("book_table")
      .notNullable()
      .onDelete("cascade");

    tbl
      .boolean("loaned")
      .notNullable()
      .defaultTo(false);

    tbl.timestamp("loaned_at", { useTz: false });

    tbl.timestamp("due_date", { useTz: false });

    tbl
      .boolean("returned")
      .notNullable()
      .defaultTo(false);

    tbl.timestamp("returned_at", { useTz: false });

    tbl
      .boolean("denied")
      .notNullable()
      .defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("request_table");
};
