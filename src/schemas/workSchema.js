const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    hoursWorked: { type: Number, default: 0 },
    moneyEarned: { type: Number, default: 0 },
    success: { type: Number, default: 0 },
    fail: { type: Number, default: 0 },
    promotionValue: { type: Number, default: 0 }
})

module.exports = mongoose.model('WorkModels', workSchema);