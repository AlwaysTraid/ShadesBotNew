const crimeModel = require('../schemas/crimeSchema');
const mongoose = require('mongoose');
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');


module.exports = (client) => {
    client.checkCrime = async (member, crimeType, interaction, time) => {
        const current_time = Date.now();
    
        crimeData = await client.findCrime(interaction.member);
        if(crimeData.cooldown) {

            let temp_cooldown = crimeData.cooldown;
            //console.log(temp_cooldown);
            let crimeCooldown = await temp_cooldown.find(v => v.cmd.includes(crimeType));
            if(!crimeCooldown){
                let cooldown = {
                    cmd: crimeType,
                    expirationTime: (Date.now() + time)
                }
                //console.log(cooldown);
                try{
                    await crimeModel.findOneAndUpdate(
                        {
                            userID: member.id,
                        },
                        {
                            $push: {
                                cooldown: cooldown,
                            },
                        }
                    );
                }catch(err){
                    console.log(err)
                }
                return true;
            }else{
                if(current_time < crimeCooldown.expirationTime) {
                    //Time Still Left
                    return false;
                }else{
                    //LEFT OFF HERE FIX THIS >
                    let temp = await temp_cooldown.map(function(x) {return x.cmd; }).indexOf(crimeType)
                    temp_cooldown.splice(temp, 1);
                    let cooldown = {
                        cmd: crimeType,
                        expirationTime: (Date.now() + Number(command.cooldown))
                    }
                    temp_cooldown.push(cooldown)
                    try{
                        await crimeModel.findOneAndUpdate(
                            {
                                userID: member.id,
                            },
                            {
                                $set: {
                                    cooldown: temp_cooldown,
                                },
                            }
                        );
                    }catch(err){
                        console.log(err)
                    }
                    return true;
                }
            }
		} else {
			return true;
		};
    };
};


function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if(hours == "00"){
        if(minutes == "00"){
			seconds = parseInt(seconds);
			return seconds + " seconds";
        }
		minutes = parseInt(minutes)	
		seconds = parseInt(seconds);
		return minutes + " minutes, " + seconds + " seconds";

    }
	hours = parseInt(hours)
	minutes = parseInt(minutes)
	seconds = parseInt(seconds);
	return hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
  
}