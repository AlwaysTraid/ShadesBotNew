const cooldownModel = require('../schemas/cooldownSchema');
const mongoose = require('mongoose');
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');


module.exports = (client) => {
    client.checkCooldown = async (member, command, interaction) => {
        if(command.cooldown) {
			const current_time = Date.now();
		
			cooldownData = await client.findCooldown(interaction.member);
			if(cooldownData.cooldown) {

				let temp_cooldown = cooldownData.cooldown;
                //console.log(temp_cooldown);
				let cooldownCmd = await temp_cooldown.find(v => v.cmd.includes(interaction.commandName));
				if(!cooldownCmd){
					let cooldown = {
						cmd: interaction.commandName,
						expirationTime: (Date.now() + Number(command.cooldown))
					}
                    //console.log(cooldown);
					try{
						await cooldownModel.findOneAndUpdate(
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
					if(current_time < cooldownCmd.expirationTime) {
						const time_left = (cooldownCmd.expirationTime -  current_time)

						cooldownEmbed = new EmbedBuilder()
						.setTitle("Woah! Chill out there..")
						//.setColor("RANDOM")
						.setDescription(`Lets slow down a bit. No one is in a rush. Wait **${msToTime(time_left)}** before using **/${interaction.commandName}**.\nThe default cooldown is \`${msToTime(command.cooldown)}\`, but [patrons](https://www.patreon.com/join/Traid?) only have to wait \`${msToTime(command.donorcooldown)}\``);
		
						interaction.reply({embeds: [cooldownEmbed]});
                        //console.log("REACHED");
                        return false;
					}else{
						let temp = await temp_cooldown.map(function(x) {return x.cmd; }).indexOf(interaction.commandName)
						temp_cooldown.splice(temp, 1);
						let cooldown = {
							cmd: interaction.commandName,
							expirationTime: (Date.now() + Number(command.cooldown))
						}
						temp_cooldown.push(cooldown)
						try{
							await cooldownModel.findOneAndUpdate(
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