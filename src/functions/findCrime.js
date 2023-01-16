const crimeModel = require('../schemas/crimeSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.findCrime = async (member) => {

        //console.log(member.id);

        let cooldown = await crimeModel.findOne({ userID: member.id });

        if(cooldown){
            //console.log("Already made");
            return cooldown;
        }else{
           cooldown = await crimeModel.create({
                userID: member.id,
                cooldown: [],
        });
            await cooldown.save().catch(err => console.log(err));

            console.log(`Created Crime List for User: ${member}`)

            return cooldown;
        }
    };
};