const mongoose = require('mongoose');


const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    }
});

module.exports = mongoose.model("Organization", organizationSchema);