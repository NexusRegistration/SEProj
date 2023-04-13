const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const Subject = require('../../models/Subject');
const Class = require('../../models/Class');
const { hasNull } = require('../../functions/searching');

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

router.post('/delete-subject', async (req, res) => {
    try {
        const subjectID = req.body.subjectID;
        console.log("subjectID: ", subjectID); //DEBUG
    
        // Find all classes and populate the subject
        // We need to do this because subject is a ref, which means we can't search by it
        const classes = await Class.find({ subject: subjectID }).exec();
    
        // If we got the classes, figure out which ones need to go
        const classesToBeDeleted = classes.filter((obj) => !hasNull(obj));
        console.log('Classes to be deleted: ', classesToBeDeleted); //DEBUG
    
        // Remove these classes from students' registrations
        for (const elem of classesToBeDeleted) {
            // Populate the class to get its students
            const foundClass = await Class.findById(elem._id).populate('students').exec();
            console.log('Now removing: ', foundClass); //DEBUG
    
            // For every student in every class that needs to be deleted
            for (const student of foundClass.students) {
                console.log('Removing from student ', student.name); //DEBUG
                // Pull that class from their 'class' list
                await User.updateOne({ _id: student._id }, { $pull: { class: foundClass._id } }).exec();
                console.log(
                    `Class: (ID: ${foundClass._id}) was removed from student: ${student.name} (ID: ${student._id})`
                );
            }
        }
    
        // Now that the students no longer have references to those classes, let's remove them
        const deleteResult = await Class.deleteMany({ _id: { $in: classesToBeDeleted } }).exec();
        console.log(`${deleteResult.deletedCount} classes deleted`);
    
        // Delete the actual subject
        const deleteSubjectResult = await Subject.deleteOne({ _id: subjectID }).exec();
        console.log(`Subject with ID ${subjectID} deleted`);
    
        res.send();
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Internal Server Error');
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