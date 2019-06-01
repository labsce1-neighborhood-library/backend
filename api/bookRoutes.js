const express = require('express');
const router = express.Router();
const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

router.post('/:id', (req, res) => {
    const {id} = req.params;
    const book = req.body;
    book.user_id = id;
    db('books')
        .insert(book)
        .then(id => {
            res.status(200).json({"id":id[0]});
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    db('books')
        .where({id})
        .then(book => {
            if(book.length > 0){
                res.status(200).json(book[0]);
            }else{
                res.status(400).json({"user_error":"book with that id does not exist","id":id});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const body = req.body;
    db('books')
        .where({id})
        .update(body)
        .then(count =>{
            if(count > 0){
                res.status(200).json({"updated":body});
            }else{
                res.status(400).json({"user_error":"did not update"});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    db('books')
        .where({id})
        .del()
        .then(count => {
            if(count > 0){
                res.status(200).json({"deleted":id});
            }else{
                res.status(400).json({"user_error":"book with that id does not exist", id});
            }
        })
        .catch(err => res.status(500).json({"server_error":err.message}));
});

module.exports = router;