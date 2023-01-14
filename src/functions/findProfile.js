const profileModel = require('../schemas/profileSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.findProfile = async (member) => {
        let profile = await profileModel.findOne({ userID: member.id });

        if(profile){
            return profile;
        }else{
            try{
                profile = await profileModel.create({
                        userID: member.id,
                        serverID: member.guild.id,
                        coins: 1000,
                        bank: 0,
                        bankMax: 20000,
                        xp: 0,
                        level: 0,
                        pet: null,
                        job: null,
                        inventory: [],
                        dailyStreak: 0,
                        lastDaily: 0,
                        lastWeekly: 0,
                        lastMonthly: 0,
                        commandCount: 0,
                    });
                await profile.save().catch(err => console.log(err));await profile.save().catch(err => console.log(err));
                console.log(`Created User: ${member}`)
            }catch(err){
                console.log("Undocumented User.");
            }

            return profile;
        }
    };
};