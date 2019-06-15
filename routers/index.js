/*Import all routers here and add them to the module.exports file */
const userRouter = require("../routers/userRouter");
const bookRouter = require("../routers/bookRouter");
const messageRouter = require("../routers/messageRouter");

module.exports = {
    userRouter,
    bookRouter,
    messageRouter
}