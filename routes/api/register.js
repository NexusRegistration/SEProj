const express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const User = require('../../models/User');
const Clss = require('../../models/Class');
const Schedule = require('../../models/Schedule');
const Room = require('../../models/Room');
const Timestamp = require('../../models/Timestamp');

const moment = require('moment');

router.post('/wishlist', isLoggedIn, async (req, res) => {
    console.log(req.body);
    try {
        const classId  = mongoose.Types.ObjectId(req.body.classId);
        const userId = req.session.user._id

        const savedUser = await addToWishlist(userId, classId);
        console.log(savedUser.message);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/add', isLoggedIn, async (req, res) => {
    console.log(req.body);
    try {
        const classId  = mongoose.Types.ObjectId(req.body.classId);
        const userId = req.session.user._id

        const savedUser = await addToList(userId, classId);
        console.log(savedUser.message);
        res.send(savedUser.message);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/waitlist', isLoggedIn, async (req, res) => {
  console.log(req.body);
  try {
    const classId  = mongoose.Types.ObjectId(req.body.classId);
    const userId = req.session.user._id;

    const savedUser = await addToWaitlist(userId, classId);
    console.log(savedUser.message);
    res.send(savedUser.message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/remove', isLoggedIn, async (req, res) => {
  console.log(req.body);
  try {
    const classId  = mongoose.Types.ObjectId(req.body.classId);
    const userId = req.session.user._id

    const removedClass = await removeFromList(userId, classId);
    console.log(removedClass.message);
    res.send(removedClass.message);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/removewish', isLoggedIn, async (req, res) => {
  console.log(req.body);
  try {
    const classId  = mongoose.Types.ObjectId(req.body.classId);
    const userId = req.session.user._id

    const removedClass = await removeFromWishlist(userId, classId);
    console.log(removedClass.message);
    res.send(removedClass.message);
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

function isLoggedIn(req, res, next) {
    if (req.session.user) {
      next(); // Continue to the next function
    } else {
      res.status(401).send('Unauthorized');
    }
  }

async function addToList(studentId, classId) {
    try {
      const student = await User.findById(studentId);
      const classObj = await Clss.findById(classId);
      const newTimestamp = new Timestamp({
        user: student._id,
        class: classObj._id,
        student: student._id,
        description: 'student_registered'
    });
  
      console.log("\nAdding " + classObj + " to " + student.name + "'s Class List\n");

      // Check if the class is already in the student's wishlist
      if (student.wishlist && !student.wishlist.includes(classId)) {
        throw new Error('The class is somehow not in the student\'s wishlist.');
      }
  
      // Check if the class is already in the student's class list
      if (student.class && student.class.includes(classId)) {
        throw new Error('The class is already in the student\'s list.');
      }

      const hasConflict = await checkTimeConflict(studentId, classId);
      if (hasConflict) {
        throw new Error('This student already has a class at this time.');
      }

      const classFull = await isClassFull(classId);
      if (classFull) {
        throw new Error('The class is full.');
      }
      console.log("classFull: " + classFull);

      // Add the class ID to the student's class array
      student.class.push(classObj);

      classObj.students.push(student._id);

      //Remove the class from the wishlist
      student.wishlist.pull(classObj);
      
      // Save timestamp
      await newTimestamp.save();
  
      // Save the updated student document to the User collection
      await student.save().catch(err => {
        console.error('Error saving student:', err);
        throw err;
      });

      // console.log('classObj before save:', JSON.stringify(classObj, null, 2));
      // await classObj.save().catch(err => {
      //   console.error('Error saving class:', err);
      //   throw err;
      // });
      await Clss.findByIdAndUpdate(classId, { $addToSet: { students: studentId } }, { new: true });

      // window.location.reload();
      // alert(`The class ${classObj} has been added to ${student.name}'s class list.`);
  
      return {
        success: true,
        message: `The class ${classObj} has been added to ${student.name}'s class list.`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async function removeFromList(studentId, classId) {
    try { 
      const student = await User.findById(studentId);
      const classObj = await Clss.findById(classId);
      const newTimestamp = new Timestamp({
        user: student._id,
        class: classObj._id,
        student: student._id,
        description: 'student_unregistered'
      });
  
      console.log("\nRemoving " + classObj + " from " + student.name + "'s Class List\n");
  
      // Check if the class is already in the student's wishlist
      if (student.wishlist && student.wishlist.includes(classId)) {
        throw new Error('The class is in the student\'s wishlist.');
      }
  
      // Check if the class is already in the student's class list
      if (!student.class || !student.class.includes(classId)) {
        throw new Error('The class is not in the student\'s list.');
      }
  
      // Remove the class ID from the student's class array
      student.class.pull(classObj._id);

      Clss.findByIdAndUpdate(classId, { $pull: { students: studentId } }, { new: true })
      .then(updatedClass => {
        console.log(`Student with ID ${studentId} has been removed from class with ID ${classId}`);
        console.log(updatedClass);
      })
      .catch(err => {
        console.error(`Error removing student with ID ${studentId} from class with ID ${classId}`);
        console.error(err);
      });
  
      // Save timestamp
      await newTimestamp.save();
  
      // Save the updated student document to the User collection
      await student.save();
      //await classObj.save();
  
      return {
        success: true,
        message: `The class ${classObj} has been removed from ${student.name}'s class list.`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

// Add a class to the wishlist of a student
async function addToWishlist(studentId, classId) {
  try {
    const student = await User.findById(studentId);
    const classObj = await Clss.findById(classId).exec();

    console.log("\nAdding " + classObj + " to " + student.name + "'s Wishlist\n");


    // Check if the class is already in the student's wishlist or class list
    if ((student.wishlist && student.wishlist.includes(classId)) || student.class.includes(classId)) {
      throw new Error('The class is already in the student\'s list.');
    }

    // Add the class ID to the student's wishlist array
    student.wishlist.push(classObj);

    // Save the updated student document to the User collection
    await student.save();

    return {
      success: true,
      message: `The class ${classObj} has been added to the wishlist of ${student.name}.`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

  async function removeFromWishlist(studentId, classId) {
    try { 
      const student = await User.findById(studentId);
      const classObj = await Clss.findById(classId);
  
      console.log("\nRemoving " + classObj + " from " + student.name + "'s Wishlist\n");
  
      // Check if the class is already in the student's class list
      if (!student.wishlist || !student.wishlist.includes(classId)) {
        throw new Error('The class is not in the student\'s wishlist.');
      }
  
      // Remove the class ID from the student's class array
      student.wishlist.pull(classObj);
  
      // Save the updated student document to the User collection
      await student.save();
  
      return {
        success: true,
        message: `The class ${classObj} has been removed from ${student.name}'s wishlist.`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Add a class to the wishlist of a student
async function addToWaitlist(studentId, classId) {
  try {
    const student = await User.findById(studentId);
    const classObj = await Clss.findById(classId).exec();

    console.log("\nAdding " + classObj + " to " + student.name + "'s Wishlist\n");


    // Check if the class is already in the student's wishlist or class list
    if (student.waitlist && student.waitlist.includes(classId)) {
      throw new Error('The class is already in the student\'s waitlist.');
    }

    student.waitlist.push(classObj);
    student.wishlist.pull(classObj);

    await Clss.findByIdAndUpdate(classId, { $addToSet: { waitlist: studentId } }, { new: true });
    await student.save();

    return {
      success: true,
      message: `The class ${classObj} has been added to the waitlist of ${student.name}.`
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

  async function removeFromWaitlist(studentId, classId) {
    try { 
      const student = await User.findById(studentId);
      const classObj = await Clss.findById(classId);
  
      console.log("\nRemoving " + classObj + " from " + student.name + "'s Wishlist\n");
  
      // Check if the class is already in the student's class list
      if (!student.wishlist || !student.wishlist.includes(classId)) {
        throw new Error('The class is not in the student\'s wishlist.');
      }
  
      // Remove the class ID from the student's class array
      student.wishlist.pull(classObj);
  
      // Save the updated student document to the User collection
      await student.save();
  
      return {
        success: true,
        message: `The class ${classObj} has been removed from ${student.name}'s wishlist.`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  const checkTimeConflict = async (userId, classId) => {
    const user = await User.findById(userId).populate('class');
    const clss = await Clss.findById(classId);
    const sched = await Schedule.findById(clss.schedule._id).populate('classTimes');
    var classSchedules = await Promise.all(user.class.map(async (classId) => {
      const classData = await Clss.findById(classId);
      const schedule = await Schedule.findById(classData.schedule._id).populate('classTimes');
      return schedule;
    }));

    if (classSchedules.length === 0) {
      return false;
    }
    
    // Flatten the array of class schedules and sort by day and start time
    const flattenedSchedules = classSchedules.flatMap(schedule => schedule.classTimes);

    for (let i = 0; i < sched.classTimes.length; i++) {
      const newClassTime = sched.classTimes[i];
      for (let j = 0; j < flattenedSchedules.length; j++) {
        const existingClassTime = flattenedSchedules[j];
        if (newClassTime.day === existingClassTime.day) {
          const newStartTime = moment(`2023-01-01T${newClassTime.startTime}`, 'YYYY-MM-DDThh:mm A').toDate();
          const newEndTime = moment(`2023-01-01T${newClassTime.endTime}`, 'YYYY-MM-DDThh:mm A').toDate();
          const existingStartTime = moment(`2023-01-01T${existingClassTime.startTime}`, 'YYYY-MM-DDThh:mm A').toDate();
          const existingEndTime = moment(`2023-01-01T${existingClassTime.endTime}`, 'YYYY-MM-DDThh:mm A').toDate();
          if ((existingEndTime >= newStartTime && existingStartTime <= newStartTime) ||
              (newEndTime >= existingStartTime && newStartTime <= existingStartTime)) {
                return true; // There is a conflict
          }
        }
      }
    }
    console.log("No conflicts");
    return false; // There is no conflict
  };

  const isClassFull = async (classId) => {
    const classInstance = await Clss.findById(classId).populate('room').populate('students').lean();
    const classInstance2 = await Clss.findById(classId).populate('students');
    const classStudents = classInstance2.students;
    console.log("Capacity: " + classInstance.room.capacity);
    if (!classStudents) { return false; }
    console.log("Students length: " + classStudents.length);
    return classStudents.length >= classInstance.room.capacity;
  };
  
module.exports = router;