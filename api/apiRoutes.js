const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes.js');
const bookRoutes = require('./bookRoutes.js');

router.use('/user', userRoutes);
router.use('/book', bookRoutes);

router.get('/', (req, res) => {
    res.status(200).json({"message":"api routing working"});
});

module.exports = router;