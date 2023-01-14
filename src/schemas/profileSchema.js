const mongoose = require('mongoose');


const Item = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    type: { type: String, default: "Collectable"},
    aliases: { type: Array, default: [] },
    useable: { type: Boolean, default: false},
    cost: { type: Number, required: true },
    time: { type: Number },
    sell: { type: Number, default: 0},
    description: String,
    image: { type: String }
});

const activeItem = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    description: String,
    image: { type: String },
    time: { type: Number, default: 0 },
})


const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    serverID: { type: String, require: true },
    coins: { type: Number, default: 1000 },
    bank: { type: Number, default: 0},
    bankMax: {type: Number, default: 20000 },
    donorLevel: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    level: {type: Number, default: 0},
    pet: {type: String},
    job: {type: String},
    inventory: [Item],
    dailyStreak: {type: Number, default: 0},
    lastDaily: { type: Number, default: 0 },
    lastWeekly: { type: Number, default: 0 },
    lastMonthly: { type: Number, default: 0 },
    commandCount: { type: Number, default: 0},
    activeItems: [activeItem]
});

module.exports = mongoose.model('ProfileModels', profileSchema);