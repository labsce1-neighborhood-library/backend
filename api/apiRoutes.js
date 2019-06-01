const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');

router.use('/user', userRoutes);

router.get('/', (req, res) => {
    res.status(200).json({"message":"api routing working"});
});

module.exports = router;