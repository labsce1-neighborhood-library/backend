// Import the dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");
const db = require("../db/config.js");

// Configure chai
chai.use(chaiHttp);
chai.should();

/****************************
 * CANNOT TRUNCATE TABLE WITH FOREIGN KEY REFERENCE
 * ***************************/
beforeEach(async () => {
  // await db("book_table").truncate();
  await db("book_table")
    .del()
    .where("book_id" > 0);
  await db.seed.run();
});

describe("Book", () => {
  describe("GET /book/all with empty database", () => {
    // Test to get all books with empty database
    it("should return an empty array", async () => {
      const deleted = await db("book_table").del();

      return new Promise(resolve => {
        chai
          .request(server)
          .get("/book/all")
          .end((err, res) => {
            res.body.should.be.a("array");
            res.body.should.have.lengthOf(0);
            resolve();
          });
      });
    });
  });

  describe("GET /book/all with nonempty database", () => {
    // Test to get all books
    it("should return an array of length 3", async () => {
      // await db.seed.run();
      return new Promise(resolve => {
        chai
          .request(server)
          .get("/book/all")
          .end((err, res) => {
            res.body.should.be.a("array");
            res.body.should.have.lengthOf(3);
            resolve();
          });
      });
    });
  });

  describe("GET /book/1 return book of id=1", () => {
    it("should return an array of length 1", done => {
      chai
        .request(server)
        .get("/book/1")
        .end((err, res) => {
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);
          done();
        });
    });

    it("should return an object in the array", done => {
      chai
        .request(server)
        .get("/book/1")
        .end((err, res) => {
          res.body[0].should.be.a("object");
          done();
        });
    });

    it("should return specific object in array", done => {
      chai
        .request(server)
        .get("/book/1")
        .end((err, res) => {
          JSON.stringify(res.body[0]).should.equal(
            JSON.stringify({
              book_id: 1,
              user_id: 1,
              isbn: "9780307277923",
              condition: "good",
              loaned: false,
              created_at: "2019-06-05T22:25:48.719Z",
              updated_at: "2019-06-05T22:25:48.719Z"
            })
          );
          done();
        });
    });
  });

  describe("GET /book/all with nonempty database", () => {
    // Test to get all books
    it("should return an array of length 3", async () => {
      // await db.seed.run();
      return new Promise(resolve => {
        chai
          .request(server)
          .get("/book/all")
          .end((err, res) => {
            res.body.should.be.a("array");
            res.body.should.have.lengthOf(3);
            resolve();
          });
      });
    });
  });

  describe("GET /book/by-user/:id", () => {
    // Test to get all books
    it("should return an array of length 3", async () => {
      // await db.seed.run();
      return new Promise(resolve => {
        chai
          .request(server)
          .get("/book/by-user/1")
          .end((err, res) => {
            res.body.should.be.a("array");
            res.body.should.have.lengthOf(3);
            resolve();
          });
      });
    });
  });

  describe("POST /book/post-book/1 return id of new book", () => {
    it("should return an array of length 1", done => {
      chai
        .request(server)
        .post("/book/post-new/1")
        .send({
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          loaned: false,
          created_at: "2019-06-05T22:25:48.719Z",
          updated_at: "2019-06-05T22:25:48.719Z"
        })
        .end((err, res) => {
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);
          done();
        });
    });

    it("should return an object in the array", done => {
      chai
        .request(server)
        .post("/book/post-new/1")
        .send({
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          loaned: false,
          created_at: "2019-06-05T22:25:48.719Z",
          updated_at: "2019-06-05T22:25:48.719Z"
        })
        .end((err, res) => {
          chai.expect(res.body[0]).to.be.a("object");

          done();
        });
    });
    it("should return specific object", done => {
      chai
        .request(server)
        .post("/book/post-new/1")
        .send({
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          loaned: false,
          created_at: "2019-06-05T22:25:48.719Z",
          updated_at: "2019-06-05T22:25:48.719Z"
        })
        .end((err, res) => {
          // Manually setting book_id in stringify to accommodate incrementing during tests
          chai
            .expect(JSON.stringify({ ...res.body[0], book_id: 130 }))
            .to.equal(
              JSON.stringify({
                book_id: 130,
                user_id: 1,
                isbn: "9780375702709",
                condition: "okay",
                loaned: false,
                created_at: "2019-06-05T22:25:48.719Z",
                updated_at: "2019-06-05T22:25:48.719Z"
              })
            );

          done();
        });
    });
  });

  describe("PUT /book/update/:id", () => {
    it("should return an array of length 1", done => {
      chai
        .request(server)
        .put("/book/update/1")
        .send({
          condition: "excellent",
          loaned: true
        })
        .end((err, res) => {
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(1);
          done();
        });
    });

    it("should return object in array, entry just updated", done => {
      chai
        .request(server)
        .put("/book/update/3")
        .send({
          condition: "good",
          loaned: true
        })
        .end((err, res) => {
          chai.expect(JSON.stringify(res.body[0])).equal(
            JSON.stringify({
              book_id: 3,
              user_id: 1,
              isbn: "9780679725312",
              condition: "good",
              loaned: true,
              created_at: "2019-06-05T22:25:48.719Z",
              updated_at: "2019-06-05T22:25:48.719Z"
            })
          );
          done();
        });
    });
  });

  describe("DELETE /book/:id, should return number of entries deleted", () => {
    it("should return a 1 if the book existed", done => {
      chai
        .request(server)
        .delete("/book/delete/3")
        .end((err, res) => {
          res.body.should.equal(1);
          done();
        });
    });

    it("should return a 0 if the book doesn't exist", done => {
      chai
        .request(server)
        .delete("/book/delete/77")
        .end((err, res) => {
          res.body.should.equal(0);
          done();
        });
    });

    it("should delete entry", async () => {
      const deleteValue = await db("book_table")
        .del()
        .where({ book_id: 1 });

      if (deleteValue) {
        return new Promise(resolve => {
          chai
            .request(server)
            .get("/book/1")
            .end((err, res) => {
              res.body.should.be.a("array");
              res.body.length.should.equal(0);
              resolve();
            });
        });
      }
    });
  });
});
