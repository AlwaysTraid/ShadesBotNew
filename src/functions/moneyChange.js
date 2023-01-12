const profileModel = require('../schemas/profileSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.addCoins = async (member, amount) => {
        try {
                
            await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $inc: {
                        coins: amount,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    client.removeCoins = async (member, amount) => {
        try {
                
            await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $inc: {
                        coins: -amount,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };
    
    client.addBank = async (member, amount) => {
        try {
                
            await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $inc: {
                        bank: amount,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    client.removeBank = async (member, amount) => {
        try {
                
            await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $inc: {
                        bank: -amount,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

};