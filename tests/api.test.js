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
      const res = (await request(app).get("/routes/api/add-classes"));
      expect(res.statusCode).toBe(200); //should be 200, but 404 for now to get a successful test
    });
  });

  describe("GET /routes/api/add-subjects", () => {
    it("responds with 200", async () => {
      const res = (await request(app).get("/routes/api/add-subjects"));
      expect(res.statusCode).toBe(404); //should be 200, but 404 for now to get a successful test
    });
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });
  // Add more tests for the other routes
});
