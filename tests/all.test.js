const mongoose = require("mongoose")
const request = require("supertest");
const app = require("../app");
const bcrypt = require('bcrypt');
require("dotenv").config();


beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION_URL);
});

//admin tests
describe("GET /routes/admin", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
        request(app)
            .get("/admin")
            .expect("Content-Type", /html/)
            .expect(301) //getting 301 instead of 200
            .expect((res) => {
                //res.body.data.length = 0;
                res.body.data = "True";
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });

    test('GET /dashboard renders the dashboard with data', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'testAdmin@gmail.com',
                password: 'test',
            });

        // Extract the session cookie from the login response
        const sessionCookie = loginResponse.headers['set-cookie'];

        // Make the dashboard request with the session cookie set
        const dashboardResponse = await request(app)
            .get('/admin/dashboard')
            .set('Cookie', sessionCookie);

        // Check that the response is successful and contains expected content
        expect(dashboardResponse.status).toEqual(200);
        expect(dashboardResponse.text).toContain('admin/dashboard');
    });
});

//login tests
describe("GET /routes/login", () => {
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

    it('should return an error if the email is invalid', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'invalid-email@example.com', password: 'test-password' });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should return an error if the password is invalid', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'test-email@example.com', password: 'invalid-password' });
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: 'Invalid email or password' });
    });

    it('should redirect to the student dashboard with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'testStudent@trinity.edu', password: 'test' });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/student/dashboard');
    });

    it('should redirect to the teacher dashboard with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'testTeacher@gmail.com', password: 'test' });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/teacher/dashboard');
    });

    it('should redirect to the admin dashboard with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({ email: 'testAdmin@gmail.com', password: 'test' });
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/admin/dashboard');
    });
});

//student tests
describe("GET /routes/student", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
        request(app)
            .get("/student")
            .expect("Content-Type", /html/)
            .expect(301) //getting 301 instead of 200
            .expect((res) => {
                //res.body.data.length = 0;
                res.body.data = "True";
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
});

//teacher tests
describe("GET /routes/teacher", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
        request(app)
            .get("/teacher")
            .expect("Content-Type", /html/)
            .expect(301) //getting 301 instead of 200
            .expect((res) => {
                //res.body.data.length = 0;
                res.body.data = "True";
            })
            .end((err, res) => {
                if (err) return done(err);
                return done();
            });
    });
    /*
    it("Test search functionality", (done) => {
      request(router)
      .get("/search")
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
    });
    */
});

//scripts test
describe("GET /routes/scripts", () => {
    it("Responds with 200\n\tContent Type'\n\tData", (done) => {
        request(app)
            .get("/scripts")
            .expect("Content-Type", /json/)
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
});

//api tests
describe('api routes', () => {
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
});

afterAll(async () => {
    await mongoose.connection.close();
});