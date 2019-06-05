// Import the dependencies for testing
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js");
const db = require("../db/config.js");

// Configure chai
chai.use(chaiHttp);
chai.should();

/*****************************************
CANNOT TRUNCATE TABLE WITH FOREIGN KEY

beforeEach(async () => {
  await db("book_table").truncate();
  await db("user_table").truncate();
});

describe("User", () => {
  describe("GET /user/all with empty database", () => {
    // Test to get all users with empty database
    it("should return an empty array if database is empty", done => {
      chai
        .request(server)
        .get("/user/all")
        .end((err, res) => {
          res.body.should.be.a("array");
          res.body.should.have.lengthOf(0);
          done();
        });
    });
  });
**********************************************/
describe("User", () => {
  describe("GET /user/all with nonempty database", () => {
    // Test to get all users
    it("should return an array of length 1", async () => {
      await db.seed.run();
      return new Promise(resolve => {
        chai
          .request(server)
          .get("/user/all")
          .end((err, res) => {
            res.body.should.be.a("array");
            res.body.should.have.lengthOf(1);
            resolve();
          });
      });
    });
  });
});
