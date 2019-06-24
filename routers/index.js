/*Import all routers here and add them to the module.exports file */
const userRouter = require("../routers/userRouter");
const bookRouter = require("../routers/bookRouter");
<<<<<<< HEAD
const authRouter = require('../routers/authRouter');
=======
const messageRouter = require("../routers/messageRouter");
>>>>>>> 67bc01254c9f5f21a711db89793ec97a733ec0d4

module.exports = {
    userRouter,
    bookRouter,
<<<<<<< HEAD
    authRouter,
=======
    messageRouter
>>>>>>> 67bc01254c9f5f21a711db89793ec97a733ec0d4
}