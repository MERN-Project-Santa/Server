process.env.NODE_ENV = "test";

const { mongoose } = require("../config/mongoose");
const User = require("../models/user");
const { app } = require("../app");

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);

describe("Auth Tests", () => {
  const newUser = {
    username: "Test User",
    email: "test@email.com",
    password: "this_is_a_password",
  };

  before((done) => {
    chai.request(app).get("/auth/logout");
    done();
  });

  after((done) => {
    mongoose.connection;
    User.deleteMany({}, (err) => {}).then(() => {
      mongoose.disconnect();
    });
    done();
  });

  describe("/POST /auth/register", () => {
    it("Should allow a user to register", (done) => {
      chai
        .request(app)
        .post("/auth/register")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user.username.should.be.eql("Test User");
        });
      done();
    });
  });

  describe("/POST /auth/login", () => {
    it("Should let a valid user log in", (done) => {
      const returningUser = {
        username: "Test User",
        password: "this_is_a_password",
      };
      chai
        .request(app)
        .post("/auth/register")
        .send(returningUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.user.username.should.be.eql("Test User");
        });
      done();
    });

    it("Should not allow a log in with invalid details", (done) => {
      const invalidUser = {
        username: "Invalid",
        password: "invalid",
      };
      chai
        .request(app)
        .post("/auth/register")
        .send(invalidUser)
        .end((err, res) => {
          res.should.have.status(401);
        });
      done();
    });
  });

  describe("GET /auth/logout", () => {
    it("Should allow a user to logout", (done) => {
      chai
        .request(app)
        .get("/auth/logout")
        .end((err, res) => {
          res.should.have.status(200);
        });
      done();
    });
  });
});
