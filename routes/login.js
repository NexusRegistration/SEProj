const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('../models/User');
const { roles } = require('../functions/authentication/auth')

const router = express.Router();

router.get('/', (req, res) => {
    return res.redirect('/login');
})

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', message: ''});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let errorMessage = '';
    // Look up the user by email
    const user = await User.findOne({ email });

    // If the user doesn't exist or the password is incorrect, set the error message
    if (!user || !(await bcrypt.compare(password, user.password))) {
        errorMessage = 'Invalid email or password';
    }

    // If there is an error message, render the login page with the message
    if (errorMessage) {
        return res.render('login', { title: 'Login', message: errorMessage });
    }
  
    // Redirect the user to the appropriate dashboard based on their role
    if (user.role === roles.STUDENT) {
        req.session.user = user;
        return res.redirect('/student/dashboard');
    } else if (user.role === roles.TEACHER) {
        req.session.user = user;
        return res.redirect('/teacher/dashboard');
    } else if (user.role === roles.ADMIN) {
        req.session.user = user;
        return res.redirect('/admin/dashboard');
    }
});

module.exports = router;