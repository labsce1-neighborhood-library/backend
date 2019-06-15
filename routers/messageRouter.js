const express = require("express");

const db = require("../db/config");
const router = express.Router();

router.get("/all", (req, res) => {
    db("messages_table")
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

module.exports = router;