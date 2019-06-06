
exports.up = function(knex, Promise) {
    return knex.schema.createTable("messages_table", tbl => {
        tbl.increments()
        tbl
          .integer("sender_id")
          .unsigned()
          .notNullable()
          .references("user_id")
          .inTable("users_table")
          .onDelete("CASCADE")
        tbl
            .integer("reciever_id")
            .unsigned()
            .notNullable()
            .references("user_id")
            .inTable("users_table")
            .onDelete("CASCADE")
        tbl.string("content").notNullable()
        tbl.datetime('time_sent', {precision: 6}).defaultTo(knex.fn.now(6));

    });
}
exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("messages_table");
};
