const knex = require('knex');
const dbConfig = require('./knexfile');

module.exports = knex(dbConfig.development); 

/* This file will allow us to reference the database when creating models 
   We will now have to import this file into each model to have access. 
*/