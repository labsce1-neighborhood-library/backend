const faker = require("faker");
/*The package faker provides all sorts of data avatar names emails etc */
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex("user_table")
//     .del()
//     .then(function() {
//       // Inserts seed entries
//       return knex("user_table").insert({
//         user_id: 1,
//         firebase_id: 1,
//         username: "sarah",
//         email: "sarah@email.com",
//         name: "Sarah",
//         latitude: 0,
//         longitude: 0,
//         lend_radius: 1
//       });
//     });
// };

/* I only commented out the above to show the rest of the 
developers we can put it back if it is not liked */

const generateSeeds = () => {
  let arr = [];
  let numOfFakeUsers = 510; 
  /* reserving the first 10 spots for developers */
  arr.push({
    user_id: 1,
    firebase_id: 1,
    username: "sarah",
    email: "sarah@email.com",
    name: "Sarah",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })

  arr.push({
    user_id: 2,
    firebase_id: 2,
    username: "sagar",
    email: "sagar@email.com",
    name: "Sagar",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })

  arr.push({
    user_id: 3,
    firebase_id: 3,
    username: "Kyle",
    email: "kyle@email.com",
    name: "Kyle",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })

  arr.push({
    user_id: 4,
    firebase_id: 4,
    username: "David",
    email: "David@email.com",
    name: "David",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })

  arr.push({
    user_id: 5,
    firebase_id: 5,
    username: "Cameron",
    email: "Cameron@email.com",
    name: "Cameron",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })

  arr.push({
    user_id: 6,
    firebase_id: 6,
    username: "JonathanH",
    email: "JonathanH@email.com",
    name: "JonathanH",
    latitude: 0,
    longitude: 0,
    lend_radius: 1
  })
  
  // start off at 2 beause of the first id. 
  
  for (let i = 10; i < numOfFakeUsers; i++ ){
    const username = faker.internet.userName();
    arr.push({
        user_id: i,
        firebase_id: i,
        username: username,
        email: `${username}@email.com`,
        name: username,
        latitude: 0,
        longitude: 0,
        lend_radius: 1
      })
  }
  return arr; 
}

exports.seed = function(knex, Promise) {
  return knex ("user_table")
    .del()
    .then(function() {
      return knex("user_table").insert(generateSeeds());
    });
};

