const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({"message":"api routing working"});
});

module.exports = router;