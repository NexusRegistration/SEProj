const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const Subject = require('../../models/Subject');
const Class = require('../../models/Class');
const Room = require('../../models/Room');
const { hasNull } = require('../../functions/searching');

router.post('/edit', (req, res) => {
    try {
        const data = req.body;
        const update = {};

        console.log("teacher data:", data.teacher);

        if (data.teacher) {
            update.teacher = data.teacher;
            console.log("teacher was found");
        }
        if (data.room) {
            update.room = data.room;
        }
        if (data.schedule) {
            update.schedule = data.schedule;
        }
        Class.findByIdAndUpdate(data.classDatabaseID, update, (err, updatedClass) => {
            if (err) {
              console.log(err);
              res.status(500).send('Error updating class.');
            } else {
              console.log('Class updated: ', updatedClass);
              res.redirect('/admin/classes');
            }
        });
    } catch (err) {
        next(err);
    }
});

router.post('/delete', (req, res) => {
    try {
        const data = req.body;
        obliterateClass(data.classID);
        res.send();
    } catch (err) {
        next(err);
    }
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
});

router.post('/edit-room-capacity', async (req,res) => {
    try {
        const data = req.body;
        const update = {
            capacity: data.capacity
        }
        Room.findByIdAndUpdate(data.roomDatabaseID, update, (err, updatedRoom) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error updating room');
            } else {
                console.log('Room updated: ', updatedRoom);
                res.redirect('/admin/class-edit?class_ID=' + data.classDatabaseID);
            }
        });
    } catch (err) {
        next(err);
    }
});

router.get('/edit-room-capacity', async (req, res) => {
    const classID = req.query.classID;
    const roomID = req.query.roomID;
    const roomData = await Room.findById(roomID);
    res.render('partials/classEditing/roomEdit', {roomData, classID, layout: false}, function(err,html) {
        res.send('<div id="wrapper">' + html + '</div>');
    });
})

router.post('/delete-subject', async (req, res) => {
    try {
        const subjectID = req.body.subjectID;
        console.log("subjectID: ", subjectID); //DEBUG
    
        // Find all classes and populate the subject
        // We need to do this because subject is a ref, which means we can't search by it
        const classesToBeDeleted = await Class.find({ subject: subjectID }).exec();
        console.log('Classes to be deleted: ', classesToBeDeleted); //DEBUG
    
        // Remove these classes from students' registrations
        for (const elem of classesToBeDeleted) {
            obliterateClass(elem._id);
        }
    
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

async function obliterateClass(classID) {
    // remove this class from users stored classes
    User.updateMany(
        { $or: [ // if a user has the classID in their classes, waitlist, or wishlist
            { class: classID }, 
            { waitlist: classID }, 
            { wishlist: classID } 
        ] }, { $pull: { // pull that class from all their collections; this doesn't throw an error if its in only one of the lists and simplifies the code
            class: classID,
            waitlist: classID,
            wishlist: classID 
        } },
        (err, result) => {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log(`${result.matchedCount} users updated`);
            } else {
                console.log('Nobody was taking that class - no users updated');
            }
        }
    );
    // delete the actual class
    Class.deleteOne({ _id: classID }, function(err) {
        if (err) { console.error(err); } 
        else {
            console.log(`Subject with ID ${classID} deleted`);
        }
    });
}

module.exports = router;