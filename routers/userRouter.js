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

// CREATE a user
router.post("/", (req, res) => {
  const user = req.body;
  db("user_table")
    .insert(user)
    .then(info => {
      db("user_table")
        .where({firebase_id:user.firebase_id})
        .then(user_info => {
          res.status(200).json({
            "message":"new user successfully created",
            "user":user_info[0]
          });
        })
        .catch(err => res.status(500).json(err.message));
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// READ a user
// by user_id
router.get("/id/:user_id", (req, res) => {
  const {user_id} = req.params;
  db("user_table")
    .where({user_id})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(400).json({
          message:"user with that user_id does not exist",
          user_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by firebase_id
router.get("/firebase_id/:firebase_id", (req, res) => {
  const {firebase_id} = req.params;
  db("user_table")
    .where({firebase_id})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(400).json({
          message:"user with that firebase_id does not exist",
          firebase_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by username
router.get("/username/:username", (req, res) => {
  const {username} = req.params;
  db("user_table")
    .where({username})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(400).json({
          message:"user with that username does not exist",
          username
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by email
router.get("/email/:email", (req, res) => {
  const {email} = req.params;
  db("user_table")
    .where({email})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(400).json({
          message:"user with that email does not exist",
          email
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

router.put("/:user_id", (req, res) => {
  const body = req.body;
  const {user_id} = req.params;
  const currentDate = new Date();
  body.updated_at = currentDate;
  db("user_table")
    .where({user_id})
    .update(body)
    .then(count => {
      if(count === 1){
        res.status(200).json({
          message:"updated user",
          body
        });
      }else{
        res.status(400).json({
          message:"user with that user_id does not exist",
          user_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

module.exports = router;
