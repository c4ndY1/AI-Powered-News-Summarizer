const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    email: String,
    password: String,
    vector: {
        type: [Number],
        validate: {
            validator: function (v) {
                return v.length === 17;
            },
            message: props => `Vector must have exactly 17 numbers, but got ${props.value.length}`
        },
        default: Array(17).fill(0) // Optional: default vector of 17 zeros
    }
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
