const express = require('express');
const router = express.Router();
const { roles, restrictAccess } = require('../functions/authentication/auth');
const Schedule = require('../models/Schedule');
const Subject = require('../models/Subject');

router.get('/dashboard', restrictAccess(roles.TEACHER), (req, res) => {
    res.render('teacher/dashboard', { user: req.session.user });
})

//These are the routes for the admin pages

router.get('/calendar', restrictAccess(roles.TEACHER), (req, res) => {
    res.render('teacher/calendar',{text: 'Hey'});
});

router.get('/classes', restrictAccess(roles.TEACHER), (req, res) => {
    res.render('teacher/classes');
});

router.get('/registration', restrictAccess(roles.TEACHER), (req, res) => {
    res.render('teacher/registration');
});

router.get('/search', restrictAccess(roles.TEACHER), async (req, res) => {
    try {
        // Get stuff from database
        const schedules = await Schedule.find();
        const subjects = await Subject.find();
        const departments = await Subject.distinct('department');
        const pathways = await Subject.distinct('pathways');
        const credits = await Subject.distinct('credits')
        res.render('classes', { schedules, subjects, departments, pathways, credits, userRole: roles.TEACHER});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/students', restrictAccess(roles.TEACHER), (req, res) => {
    res.render('teacher/students');
});
module.exports = router;