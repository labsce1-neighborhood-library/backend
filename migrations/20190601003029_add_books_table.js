
exports.up = function(knex, Promise) {
    return knex.schema.createTable('books', function(tbl) {
        tbl
            .increments();
        tbl
            .integer('user_id')
            .notNullable()
        tbl
            .string('title')
            .notNullable()
        tbl
            .string('author')
        tbl
            .integer('ISBN')
        tbl
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('books');
};
