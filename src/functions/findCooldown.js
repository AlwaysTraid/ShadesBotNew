const cooldownModel = require('../schemas/cooldownSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.findCooldown = async (member) => {

        //console.log(member.id);

        let cooldown = await cooldownModel.findOne({ userID: member.id });

        if(cooldown){
            //console.log("Already made");
            return cooldown;
        }else{
           cooldown = await cooldownModel.create({
                userID: member.id,
                cooldown: [],
        });
            await cooldown.save().catch(err => console.log(err));

            console.log(`Created Cooldown for User: ${member}`)

            return cooldown;
        }
    };
};