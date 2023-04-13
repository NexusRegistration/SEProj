const express = require('express');
const router = express.Router();
const { roles, restrictAccess } = require('../functions/authentication/auth');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Class = require('../models/Class');
const Room = require('../models/Room');
const Subject = require('../models/Subject');
const Timestamp = require('../models/Timestamp');
const SemesterSingleton = require('../models/SemesterSingleton');

router.get('/dashboard', restrictAccess(roles.ADMIN), async (req, res) => {
    try {
        // Get stuff from database
        const subjects = await Subject.find();
        const departments = await Subject.distinct('department');
        const pathways = await Subject.distinct('pathways');
        const credits = await Subject.distinct('credits');
    
        const audits = await Timestamp.find()
            .populate('user');
        
        //const users = await User.find();
        res.render('admin/dashboard', { user: req.session.user, subjects, audits});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})

//These are the routes for the admin pages
router.get('/create-user', restrictAccess(roles.ADMIN), (req, res) => {
    res.render('admin/create-user');
});

router.get('/create-class', restrictAccess(roles.ADMIN), async (req, res) => {
    try {
        // Fetch all schedules from the database
        const schedules = await Schedule.find();
        const departments = await Subject.distinct('department');
        const rooms = await Room.find();
        const buildings = await Room.distinct('building');
        const semesterObject = await SemesterSingleton.findOne({ identifier: 'semesters' }).exec();
  
        if (semesterObject) {
            const semesters = semesterObject.semesters;
            // Render the class creation form template and pass the schedules, departments, and semesters variables
            res.render('admin/create-class', { schedules, departments, rooms, buildings, semesters});
        } else {
            console.log('Semester singleton not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/create-subject', restrictAccess(roles.ADMIN), async (req, res) => {
    try {
        // Fetch all schedules from the database
        const departments = await Subject.distinct('department');

        // Render the class creation form template and pass the schedules variable
        res.render('admin/create-subject', { departments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/calendar', restrictAccess(roles.ADMIN), (req, res) => {
    res.render('admin/calendar',{text: 'Hey'});
});

router.get('/classes', restrictAccess(roles.ADMIN), async (req, res) => {
    try {
        // Get stuff from database
        const schedules = await Schedule.find();
        const subjects = await Subject.find();
        const departments = await Subject.distinct('department');
        const pathways = await Subject.distinct('pathways');
        const credits = await Subject.distinct('credits')
        res.render('classes', { schedules, subjects, departments, pathways, credits, userRole: roles.ADMIN});
        
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/users', restrictAccess(roles.ADMIN), (req, res) => {
    res.render('admin/users');
});

router.get('/audit', restrictAccess(roles.ADMIN), async (req,res) => {

    function auditValueAndDisplay(list) {
        const formattedList = list.map((item) => {
          return {
            value: item,
            display: item.split("_").map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ")
          }
        });
        return formattedList;
    }

    const auditTypes = auditValueAndDisplay(Timestamp.schema.paths.description.enumValues);
    const subjects = await Subject.find();
    const departments = await Subject.distinct('department');
    res.render('admin/audit', {auditTypes, departments, subjects});
});

router.get('/class-edit', restrictAccess(roles.ADMIN), async (req, res) => {
    const databaseClassID = req.query.class_ID;
    const classData = await Class.findById(databaseClassID)
        .populate('subject')
        .populate('teacher')
        .populate('students')
        .populate('room')
        .populate('schedule');

    const teachers = await User.find({ role: 'teacher'});
    const schedules = await Schedule.find();
    const rooms = await Room.find();
    const buildings = await Room.distinct('building');

    console.log("Class data for edit class: ", classData);
    console.log("Teacher for edit class: ", classData.teacher );

    // Render the template for the edit class page
    res.render('admin/edit-class', { classData, teachers, schedules, rooms, buildings });
});

module.exports = router;