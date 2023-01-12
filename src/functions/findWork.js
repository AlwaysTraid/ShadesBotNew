const workModel = require('../schemas/workSchema');
const mongoose = require('mongoose');


module.exports = (client) => {
    client.findWork = async (member) => {
        let work = await workModel.findOne({ userID: member.id });

        if(work){
            return work;
        }else{
           work = await workModel.create({
                userID: member.id,
                hoursWorked: 0,
                moneyEarned: 0,
                success: 0,
                fail: 0,
                promotionValue: 0,
        });
            await work.save().catch(err => console.log(err));

            console.log(`Created Work Stats for User: ${member}`)

            return work;
        }
    };
    
};