require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const db = require('../models.js/usersDB');

const {validateEmail} = require('../middleware/validateEmail');

router.post("/register", (req, res) => {
    const credentials = req.body; 
    if(!credentials.username){
        res.status(401).json({error: "Username is required for registration"})
    }
    if(validateEmail(credentials.email) === false){
        res.status(401).json({error: "Please enter a valid email"});
    }
    if (!credentials.password || credentials.password.length < 6){
        res.status(401).json({error: "Please enter a valid password that is at least 6 characters long"})
    }
    if (!credentials.name){
        res.status(401).json({error: "Please enter your name"})
    }
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash; 
    db
      .registerUser(credentials)
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json({error: `Failed register user ${err}`}));
})




