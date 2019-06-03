const express = require("express");

const db = require("../db/config");
const router = express.Router();

router.get("/all", (req, res) => {
  db("user_table")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(501).json(err);
    });
});

module.exports = router;
