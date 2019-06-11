const express = require("express");
const geolib = require("geolib");

const db = require("../db/config");
const router = express.Router();

const conditionEnum = require("../constants/conditionEnum.js");

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

// [GET] all books within radius
router.get("/by-location/:lat/:lon/:radius", async (req, res) => {
  const lat = Number(req.params.lat);
  const lon = Number(req.params.lon);
  const radius = Number(req.params.radius);

  // LAT: -90 to 90, LON: -180 to 180
  db("book_table as b")
    .select("b.*", "u.latitude", "u.longitude")
    .innerJoin("user_table as u", "u.user_id", "b.user_id")
    .then(books => {
      if (books.length) {
        const output = [];
        for (let x = 0; x < books.length; x++) {
          if (
            geolib.getPreciseDistance(
              { latitude: books[x].latitude, longitude: books[x].longitude },
              { latitude: lat, longitude: lon },
              1
            ) <=
            radius * 1609.3
          ) {
            output.push(books[x]);
          }
        }

        res.status(200).json(output);
      } else {
        res.status(200).json({ message: "No books within radius" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// [POST] new book to user id
router.post("/post-new/:id", (req, res) => {
  const newBook = req.body;
  db("book_table")
    .returning("*")
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

// [PUT] update either condition or loaned status
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const condition = req.body.condition;
  const loaned = req.body.loaned;

  let conditionResponse = null;
  let loanedResponse = null;

  try {
    if (condition in conditionEnum) {
      conditionResponse = await db("book_table")
        .returning("*")
        .update({ condition })
        .where({ book_id: id });
    }

    if (typeof loaned === "boolean") {
      loanedResponse = await db("book_table")
        .returning("*")
        .update({ loaned })
        .where({ book_id: id });
    }

    if (conditionResponse && conditionResponse[0].book_id === id) {
      res.status(200).json(conditionResponse);
    } else if (loanedResponse && loanedResponse[0].book_id) {
      res.status(200).json(loanedResponse);
    } else {
      res.status(400).send();
    }
  } catch (err) {
    res.status(500).send();
  }
});

// [DELETE] book by book_id
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db("book_table")
    .del()
    .where({ book_id: id })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({ message: "Error" });
    });
});

module.exports = router;
