const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    champion: {
        type: String,
        required: true
    },
    runnerUp: {
        type: String,
        required: true
    },
    finalsMVP: {
        type: String,
        required: true
    },
    darkHorse: {
        type: String,
        required: true
    },
    predictionDate: {
        type: Date,
        default: Date.now
    },
    confidenceLevel: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    }
});

module.exports = mongoose.model('Prediction', predictionSchema);