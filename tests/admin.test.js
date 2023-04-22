const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
require("dotenv").config();

//let server;//maybe only use one
beforeAll( async () => await mongoose.connect(process.env.DB_CONNECTION_URL));

describe('admin route', () => {
    describe("GET /routes/admin", () => {
        it("responds with 200", async () => {
          const res = await request(app).get("/admin");
          expect(res.statusCode).toBe(200);  
        });
    });  
});

afterAll(async () => await mongoose.connection.close());
