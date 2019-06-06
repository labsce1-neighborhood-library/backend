/*Import all routers here and add them to the module.exports file */
const userRouter = require("../routers/userRouter");
const bookRouter = require("../routers/bookRouter")

module.exports = {
    userRouter,
    bookRouter,
}