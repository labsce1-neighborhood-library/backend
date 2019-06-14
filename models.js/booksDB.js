const db = require("../dbConfig");

/*method that will return all books */
const getBooks = () => {
    return db("book_table");
}



/* add in every method to the export */
module.exports = {
    getBooks, 
}