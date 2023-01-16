const mongoose = require("mongoose");


const cooldown = new mongoose.Schema({
    cmd: { type: String },
    expirationTime: { type: Number },
})


const crimeSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true},
    cooldown: [cooldown]
})

module.exports = mongoose.model('CrimeModels', crimeSchema);