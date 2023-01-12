const profileModel = require('../schemas/profileSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.death = async (member, profileData) => {
        let temp_items = profileData.inventory;
        let lifesaver = await temp_items.find(v => v.id.includes("lifesaver"));

        if(lifesaver){
            let temp = await temp_items.map(function(x) {return x.id; }).indexOf(lifesaver.id)
            temp_items.splice(temp, 1)
            try {
                await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $set: {
                        inventory: temp_items,
                    },
                }
                );
            } catch (err) {
                console.log(err);
            }
            return false;
        }else{
            let rand = Math.round(Math.random()*100)+1;
            if(rand > 75){
                for(let i = 0; i < 3; i++){
                    let temp_item = temp_items[Math.floor(Math.random() * temp_items.length)]
                    console.log(temp_item)
                    if(temp_item){
                        let temp = await temp_items.map(function(x) {return x.id; }).indexOf(temp_item)
                        await temp_items.splice(temp, 1)
                    }
                }
            }
            try {
                await profileModel.findOneAndUpdate(
                {
                    userID: member.id,
                },
                {
                    $set: {
                        coins: 0,
                        inventory: temp_items,
                    },
                }
                );
            } catch (err) {
                console.log(err);
            }
            return true;
        }
      
    };
    client.randomInArray= async (array) => {
        let temp = await array[Math.floor(Math.random() * array.length)]
        return temp;
    };
    client.addCommandCount= async (member) => {
        try {
            await profileModel.findOneAndUpdate(
            {
                userID: member.id,
            },
            {
                $inc: {
                    commandCount: 1,
                },
            }
            );
        } catch (err) {
            console.log(err);
        }
    };

    client.robnotify = async(target, member, amount, succesful ) => {

        target.send(`**SOMEONE STOLE YOUR LOOT!**\n${member.tag} <@${member.id}> has stolen ${amount} from you!`)

    }

};