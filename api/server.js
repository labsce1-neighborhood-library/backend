const express = require("express");

const configureMiddleware = require("../config/middleware.js");

const server = express();

// MOST OF THIS WAS IN ./config/middleware.js FILE
// - added morgan middleware and indexed router files

// const helmet = require('helmet');
// const cors = require("cors");
// const morgan = require("morgan");

// require('dotenv').config();

// server.use(express.json())
// server.use(helmet());
// server.use(cors());
// server.use(express.json());
// server.use(morgan('dev'));

// //Add in Routes/ Endpoints here  from the index.js files in the routers folder
// const {
//     userRouter,
//     bookRouter,
//     authRouter,
// }  = require("../routers/index.js");

// // means we have to access the endpoint by first putting in /users  then any extras created in the userRouter file
// server.use('/users', userRouter);
// server.use('/books', bookRouter);
// server.use('/auth', authRouter);

configureMiddleware(server);   

module.exports = server;
