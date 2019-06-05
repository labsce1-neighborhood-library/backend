exports.up = function(knex, Promise) {
  return knex.schema.table("user_table", tbl => {
    tbl.string("payment_info");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("user_table", tbl => {
    tbl.dropColumn("payment_info");
  });
};
