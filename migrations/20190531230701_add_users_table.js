
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(tbl) {
        tbl
            .increments();
        tbl
            .string('name', 255)
            .notNullable()
            .unique();
        tbl
            .timestamp('created_at')
            .defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
