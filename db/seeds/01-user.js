exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("user_table")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("user_table").insert({
        user_id: 1,
        firebase_id: 1,
        username: "sarah",
        email: "sarah@email.com",
        name: "Sarah",
        latitude: 0,
        longitude: 0,
        lend_radius: 1
      });
    });
};
