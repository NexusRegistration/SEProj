const express = require('express');
const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
const login = require("../routes/login");
const router = express.Router();
require("dotenv").config();

//let server;


describe("GET /routes/login", () => {
  beforeAll( async () => await mongoose.connect(process.env.DB_CONNECTION_URL));
  it("Responds with 200\n\tContent Type'\n\tData", (done) => {
    request(app)
    .get("/login")
    .expect("Content-Type", /html/)
    .expect(200)
    .expect((res) => {
      //res.body.data.length = 0;
      res.body.data = "True";
    })
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
  });

  const testID = {
    email: "testAdmin@gmail.com",
    password: "test"
  };

  it("Test login functionality", (done) => {
    request(router)
    .post("/login")
    .send(testID)
    .expect(201)
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
  });
  
});

afterAll(async () => await mongoose.connection.close());
