const mongoose = require('mongoose'),
    { ObjectId } = mongoose.Schema;

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    organization: {
        type: ObjectId,
        ref: "Organization"
    }
});

module.exports = mongoose.model('Department', departmentSchema);