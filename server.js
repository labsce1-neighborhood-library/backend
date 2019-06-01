const express = require('express');
const cors = require('cors');

const apiRoutes = require('./api/apiRoutes.js');

const server = express();

server.use(cors());

server.use('/api', apiRoutes);

const port = 9000;

server.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
