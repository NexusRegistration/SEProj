const express = require('express');
var router = express.Router();
const Class = require('../../models/Class');
const mongoose = require('mongoose');
const { hasNull } = require('../../functions/searching');

router.get('/classes', async (req, res, next) => {
    try {
        const query = req.query;

        //debug
        console.log("===========QUERY==========");
        console.log(req.query);
        //end-debug

        const filter = {};
        if (query.department) {
            filter['department'] = query.department;
        }
        if (query.classID) {
            filter['classID'] = query.classID;
        } else if (query.inputLevel) {
            const firstNumMatch = new RegExp(`^${query.inputLevel}`);
            filter['classID'] = { $regex: firstNumMatch };
        }
        if (query.subject) {
            filter['className'] = { $regex: query.subject, $options: 'i' };
        }
        if (query.pathway) {
            filter['pathways'] = query.pathway;
        }
        if (query.credits) {
            filter['credits'] = query.credits;
        }
        // if (query.teacher) {
        //     filter.teacher = query.teacher;
        // }
        // if (query.room) {
        //     filter.room = query.room;
        // }
        // if (query.schedule) {
        //     filter.schedule = query.schedule;
        // }
        // if (query.semester) {
        //     filter.semester = query.semester;
        // }
        console.log("Filter: ", filter)
        const classes = await Class.find()
            .populate({
                path: 'subject',
                match: filter
            })
            .populate('schedule')
            .populate('room')

        const filteredClasses = classes.filter(obj => !hasNull(obj));
        var classEntryType = 'partials/classEntries/' + req.session.user.role + 'ClassEntry'

        res.render(classEntryType, {classes: filteredClasses, layout: false}, function(err,html) {
            res.send('<div id="classEntry-wrapper">' + html + '</div>');
        });
        
    } catch (err) {
      next(err);
    }
});
//GET route for getting subjects from department
router.get('/subjects', async (req, res) => {
    try {
      const { department } = req.query;
      const subjects = await Subject.find({ department });
      res.json(subjects);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;