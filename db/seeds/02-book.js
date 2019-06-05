exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("book_table")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("book_table").insert([
        {
          book_id: 1,
          user_id: 1,
          isbn: "9780307277923",
          condition: "good",
          loaned: false
        },
        {
          book_id: 2,
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          loaned: false
        },
        {
          book_id: 3,
          user_id: 1,
          isbn: "9780679725312",
          condition: "excellent",
          loaned: false
        }
      ]);
    });
};