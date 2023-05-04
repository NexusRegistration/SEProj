// Required dependencies
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const mime = require('mime');
const fs = require('fs');

//import bootstrap from 'bootstrap'
//const bootstrap = require('bootstrap');

// Create express app
const app = express();

// Import mongoose and environment configuration
const mongoose = require('mongoose');
require('dotenv/config');

// parsers
app.use(expressLayouts)
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

// authentication
app.use(session({
    secret: 'mysecret',
    resave: false, // do not save the session to store if it hasn't been modified
    saveUninitialized: false, // do not save the session if it hasn't been initialized
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', './layouts/layout');

// Import routers
const loginRouter = require('./routes/login');
const adminRouter = require('./routes/admin');
const studentRouter = require('./routes/student');
const teacherRouter = require('./routes/teacher');
const scriptsRoute = require('./routes/scripts');

// Import API Routers
const registrationAPIRouter = require('./routes/api/create-user');
const addClassAPIRouter = require('./routes/api/add-classes');
const subjectAPIRouter = require('./routes/api/add-subjects');
const searchClassAPIRouter = require('./routes/api/search-classes');
const registerAPIRouter = require('./routes/api/register');
const auditAPIRouter = require('./routes/api/search-audits');
//const helpAPIRouter = require('./routes/api/help');
const editClassAPIRouter = require('./routes/api/edit-classes');


// Use Routes
app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.use('/public/javascripts', scriptsRoute);

// Use API Routes
app.use('/create-user', registrationAPIRouter);
app.use('/add-classes', addClassAPIRouter);
app.use('/search-classes', searchClassAPIRouter);
app.use('/add-subjects', subjectAPIRouter);
app.use('/register', registerAPIRouter);
app.use('/search-audits', auditAPIRouter);
app.use('/edit-classes', editClassAPIRouter);
//app.user('/help', helpAPIRouter);

//Get API status -> api.test.js
const alive = "True";
app.get("/add-classes", (req, res) => res.status(200).json({ data: alive }));
app.get("/add-subjects", (req, res) => res.status(200).json({ data: alive }));
app.get("/create-user", (req, res) => res.status(200).json({ data: alive }));
app.get("/edit-class", (req, res) => res.status(200).json({ data: alive }));
app.get("/register", (req, res) => res.status(200).json({ data: alive }));
app.get("/search-audit", (req, res) => res.status(200).json({ data: alive }));
app.get("/search-classes", (req, res) => res.status(200).json({ data: alive }));
app.get("/students", (req, res) => res.status(200).json({ data: alive }));
//app.get("/help", (req, res) => res.status(200).json({ data: alive }));

//Get MISC route status
app.get("/admin", (req, res) => res.status(200).json({ data: alive })); //301 html
app.get("/login", (req, res) => res.status(200).json({ data: alive }));
app.get("/scripts", (req, res) => res.status(200).json({ data: alive }));
app.get("/student", (req, res) => res.status(200).json({ data: alive })); //301 html
app.get("/teacher", (req, res) => res.status(200).json({ data: alive })); //301 html


// Connect to database
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECTION_URL, { useNewUrlParser: true })
    .then(() => console.log('Connected to database'))
    .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

module.exports = server;