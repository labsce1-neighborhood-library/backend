const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

router.post('/', (req, res) => {
    const user = req.body;
    db('users')
        .insert(user)
        .then(id => {
            res.status(200).json({"id":id[0]});
        })
        .catch(err => res.status(500).json({"server_error": err.message}));
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
                res.status(400).json({"user_error": "user with that id does not exist", id});
            }
        })
        .catch(err => res.status(500).json({"server_error": err.message}));
});

router.get('/name/:name', (req, res) => {
    const {name} = req.params;
    db('users')
        .where({name})
        .then(user => {
            if(user.length === 1){
                res.status(200).json({
                    "id":user[0].id,
                    "username":user[0].name
                });
            }else{
                res.status(400).json({"user_error": "user with that username does not exist", name});
            }
        })
        .catch(err => res.status(500).json({"server_error": err.message}));
});

router.put('/id/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    db('users')
        .where({id})
        .update({name: body.name})
        .then(count => {
            if(count > 0){
                res.status(200).json({"new_username":body.name});
            }else{
                res.status(400).json({"user_error": "user with that id does not exist", id});
            }
        })
        .catch(err => res.status(500).json({"server_error": err.message}));
});

router.put('/name/:name', (req, res) => {
    const {name} = req.params;
    const body = req.body;
    db('users')
        .where({name})
        .update({name: body.name})
        .then(count => {
            if(count > 0){
                res.status(200).json({"new_username": body.name});
            }else{
                res.status(400).json({"user_error": "user with that username does not exist", name});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

router.delete('/id/:id', (req, res) => {
    const {id} = req.params;
    db('users')
        .where({id})
        .del()
        .then(count => {
            if(count > 0){
                res.status(200).json({"deleted":id});
            }else{
                res.status(400).json({"user_error":"user with that id does not exist", id});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

router.delete('/name/:name', (req, res) => {
    const {name} = req.params;
    db('users')
        .where({name})
        .del()
        .then(count => {
            if(count > 0){
                res.status(200).json({"deleted":name});
            }else{
                res.status(400).json({"user_error":"user with that username does not exist", name});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

module.exports = router;