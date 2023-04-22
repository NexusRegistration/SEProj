const mongoose = require('mongoose');

const semesterSingletonSchema = new mongoose.Schema({
    identifier: {
        type: String,
        unique: true,
        required: true
    },
    semesters: [{ 
        year: { type: Number }, 
        season: { type: String, enum: ['Spring', 'Fall']}
    }],
    //this is the arrayID of the current Semester
    currentSemester: { type: Number, required: true }
});

semesterSingletonSchema.pre('save', function (next) {
    const self = this;
    mongoose.models.SemesterSingleton.findOne({ identifier: self.identifier }, (err, doc) => {
        if (err) {
            return next(err);
        }
        if (doc) {
            const error = new Error('Semester singleton already exists');
            error.status = 409;
            return next(error);
        }
        next();
    });
});

const SemesterSingleton = mongoose.model('SemesterSingleton', semesterSingletonSchema);

module.exports = SemesterSingleton;