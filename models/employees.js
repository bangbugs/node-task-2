const mongoose = require('mongoose'),
    { ObjectId } = mongoose.Schema;

const employeeSchema = new mongoose.Schema({
    firstName: {
        type:   String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    department: {
        type: ObjectId,
        required: true,
        ref: "Department"
    },
    organization: {
        type: ObjectId,
        required: true,
        ref: "Organization"
    },
    experience: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("Employee", employeeSchema);