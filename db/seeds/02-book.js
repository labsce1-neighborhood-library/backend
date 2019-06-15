exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("book_table")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("book_table").insert([
        {
          user_id: 1,
          isbn: "9780307277923",
          condition: "good",
          // loaned: false,
          // created_at: "2019-06-05T22:25:48.719Z",
          // updated_at: "2019-06-05T22:25:48.719Z"
        },
        {
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          // loaned: false,
          // created_at: "2019-06-05T22:25:48.719Z",
          // updated_at: "2019-06-05T22:25:48.719Z"
        },
        {
          user_id: 1,
          isbn: "9780679725312",
          condition: "excellent",
          // loaned: false,
          // created_at: "2019-06-05T22:25:48.719Z",
          // updated_at: "2019-06-05T22:25:48.719Z"
        }
      ]);
    });
};
