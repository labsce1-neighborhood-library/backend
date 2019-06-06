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
 *
beforeEach(async () => {
  await db("book_table").truncate();
});
***************************/

describe("Book", () => {
  // describe("GET /book/all with empty database", () => {
  //   // Test to get all books with empty database
  //   it("should return an empty array", done => {
  //     chai
  //       .request(server)
  //       .get("/book/all")
  //       .end((err, res) => {
  //         res.body.should.be.a("array");
  //         res.body.should.have.lengthOf(0);
  //         done();
  //       });
  //   });
  // });

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

  describe("POST /book/post-book/1 return id of new book", () => {
    it("should return an array of length 1", done => {
      chai
        .request(server)
        .post("/book/post-book/1")
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

    it("should return an integer in the array", done => {
      chai
        .request(server)
        .post("/book/post-book/1")
        .send({
          user_id: 1,
          isbn: "9780375702709",
          condition: "okay",
          loaned: false,
          created_at: "2019-06-05T22:25:48.719Z",
          updated_at: "2019-06-05T22:25:48.719Z"
        })
        .end((err, res) => {
          chai
            .expect(res.body[0])
            .to.be.a("number")
            .above(0)
            .and.satisfy(Number.isInteger);

          done();
        });
    });
  });
});
