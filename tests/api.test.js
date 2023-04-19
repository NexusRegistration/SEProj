const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

describe('api routes', () => {
  let server;
  beforeEach(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_URL);
  });

  describe("GET /routes/api/add-classes", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/add-classes");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/add-subjects", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/add-subjects");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/create-user", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/create-user");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/edit-class", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/edit-class");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/register", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/register");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/search-audit", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/search-audit");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/search-classes", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/search-classes");
      expect(res.statusCode).toBe(200);  
    });
  });

  describe("GET /routes/api/students", () => {
    it("responds with 200", async () => {
      const res = await request(app).get("/students");
      expect(res.statusCode).toBe(200);  
    });
  });
  
  afterEach(async () => {
    await mongoose.connection.close();
  });
  // Add more tests for the other routes
});
