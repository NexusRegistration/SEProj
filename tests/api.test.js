const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

//let server;

describe('api routes', () => {
  //beforeAll( async () => await mongoose.connect(process.env.DB_CONNECTION_URL));
  describe("GET /routes/api/add-classes", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/add-classes")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });
  
  describe("GET /routes/api/add-subjects", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/add-subjects")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/create-user", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/create-user")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/edit-class", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/edit-class")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/register", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/register")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/search-audit", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/search-audit")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/search-classes", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/search-classes")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });

  describe("GET /routes/api/students", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
      request(app)
      .get("/students")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect((res) => {
        res.body.data.length = 0;
        res.body.data = "True";
      })
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
  });
  //afterAll(async () => await mongoose.connection.close());
});

