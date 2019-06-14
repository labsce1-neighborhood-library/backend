const db = require("../dbConfig");


const getUsers = () => {
    return db('user_table')
}

//user story user wants to join the site
const registerUser = (body) => {
    db("user_table")
    .insert(body)
}

//user story user wants to udpate their profile 
const updateUser = async (user_id, body) => {
    await db("user_table")
      .update(body)
      .where({user_id})
}

//user story user wants to be removed from the site. 
const deleteUser = async user_id => {
    await db("user_table")
      .where({user_id})
      .del()
}

module.exports = {
    getUsers, 
    registerUser, 
    updaeUser, 
    deleteUser, 
}