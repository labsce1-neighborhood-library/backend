const express = require("express");

const db = require("../db/config");
const router = express.Router();

// [GET] all books in database
router.get("/all", (req, res) => {
  db("book_table")
    .then(books => {
      res.status(200).json(books);
    })
    .catch(err => {
      res.status(501).json(err);
    });
});

// [GET] book by book id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db("book_table")
    .where({ book_id: id })
    .then(book => res.status(200).json(book))
    .catch(err => {
      res.status(500).json({ message: "Error retrieving books" });
    });
});

// [GET] all books by user id
router.get("/by-user/:id", (req, res) => {
  const id = req.params.id;

  db("user_table as u")
    .select("b.*")
    .innerJoin("book_table as b", "b.user_id", "u.user_id")
    .where({ "u.user_id": id })
    .then(books => {
      res.status(200).json(books);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieiving books by user id" });
    });
});

// [POST] new book to user id
router.post("/post-book/:id", (req, res) => {
  const newBook = req.body;
  db("book_table")
    .returning("book_id")
    .insert(newBook)
    .then(response => {
      if (response.length) {
        res.status(200).json(response);
      } else {
        res.status(400).json({ message: "Error posting new book" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error posting new book", err });
    });
});

module.exports = router;
