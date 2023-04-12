const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../../models/Subject');
const Class = require('../../models/Class');

router.post('/edit', (req, res) => {

});

router.post('/delete', (req, res) => {

});

router.post('/edit-Subject', (req, res) => {
    try {
        const data = req.body;
        const update = {};

        if (data.className) {
            update.className = data.className;
        }
        if (data.department) {
            update.department = data.department;
        }
        if (data.subjectID) {
            update.classID = (data.subjectID).toString();
        }
        if (data.pathways) {
            update.pathways = data.pathways;
        }
        if (data.credits) {
            update.credits = data.credits;
        }
        if (data.description) {
            update.description = data.description;
        }

        Subject.findByIdAndUpdate(data.subjectDatabaseID, update, (err, updatedSubject) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error updating subject.');
            } else {
              console.log('Subject updated: ', updatedSubject);
              res.redirect('/admin/class-edit?class_ID=' + data.classDatabaseID);
            }
        });

    } catch (err) {
      next(err);
    }
});

router.post('/delete-Subject', (req, res) => {
    try {
        const subjectID = req.body.subjectID;

        // remove the classes which have this subject from the class arrays of users
        User.updateMany(
            { class: { $elemMatch: { subject: subjectId } } }, 
            { $pull: { class: { subject: subjectId } } }, 
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error removing classes from students.');
                } else {
                    console.log('Classes removed from students: ', result);
                }
            }
        );

        Class.deleteMany({ subject: subjectID }, (err) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error deleting classes.');
            } else {
                console.log('Classes deleted.');
            }
        });

        Subject.findByIdAndRemove(subjectId, (err, removedSubject) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error deleting subject.');
            } else {
                console.log('Subject deleted: ', removedSubject);
                res.redirect('/classes');
            }
        });

    } catch {

    }
});

router.get('/edit-Subject', async (req, res) => {
    const subjectID = req.query.subjectID;
    const classID = req.query.classID;
    const departments = await Subject.distinct('department');
    const subjectData = await Subject.findById(subjectID);
    const pathways = await Subject.distinct('pathways');
    const creditOptions = Subject.schema.paths.credits.options.enum;
    res.render('partials/classEditing/subjectEdit', {subjectData, departments, pathways, creditOptions, classID, layout: false}, function(err,html) {
        res.send('<div id="wrapper">' + html + '</div>');
    });
})

module.exports = router;