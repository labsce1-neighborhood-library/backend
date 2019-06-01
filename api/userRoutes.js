const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

const SERV_ERR = "server_error";
const USER_ERR = "user_error";

router.post('/', (req, res) => {
    const user = req.body;
    db('users')
        .insert(user)
        .then(id => {
            res.status(200).json({"id":id[0]});
        })
        .catch(err => res.status(500).json({SERV_ERR: err.message}));
});

router.get('/id/:id', (req, res) => {
    const {id} = req.params;
    db('users')
        .where({id})
        .then(user => {
            if(user.length === 1){
                res.status(200).json({
                    "id":user[0].id,
                    "username":user[0].name
                });
            }else{
                res.status(400).json({USER_ERR: "user with that id does not exist"});
            }
        })
        .catch(err => res.status(500).json({SERV_ERR: err.message}));
});

module.exports = router;