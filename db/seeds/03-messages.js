const generateSeeds = () => {
  let array = [];

  for(let i=0; i<100; i++){
    array.push({
      sender_id: 1,
      receiver_id: 2,
      content: `message ${i} to Sagar from Sarah`
    });
    array.push({
      sender_id: 2,
      receiver_id: 1,
      content: `message ${i} to Sarah from Sagar`
    });
  }
  return array;
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('messages_table').del()
    .then(function () {
      // Inserts seed entries
      return knex('messages_table').insert(generateSeeds())
    });
};
