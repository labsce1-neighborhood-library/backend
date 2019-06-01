const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./api/apiRoutes.js');

const server = express();

server.use(cors());

server.use('/api', apiRoutes);

const port = process.env.PORT || 9000;

server.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
