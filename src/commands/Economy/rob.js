const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Rob someone\'s wallet. You can\'t rob a substantial amount more than whats in your wallet.')
        .addUserOption(option => option.setName("target").setDescription("The user who's profile you want to rob from").setRequired(true)),
                
    cooldown: 30000,
    async execute(interaction, client, profileData, workData){

        let user = interaction.options.getUser("target");
        if (!user) {
            return interaction.reply("Maybe try to rob someone that exists lol?");
        }

        let userProfileInfo = await client.findProfile(user)

        if(!userProfileInfo) return interaction.reply("User is undocumented. Ask them to do a command so I can find information on them.")

        //REMEMBER WHEN ADDING PADLOCK HERE TO CHECK TIMINGS ON TARGET TO SEE IF THEY EXPIRED
    		
		if (user == interaction.user) return interaction.reply("You really want to rob yourself? Practice maybe?");

		if(profileData.coins < 5000) return interaction.reply("You need a minimum of 5000 shadebucks in your wallet. Turns out robbing is not for the poor.")
		if(userProfileInfo.coins < 5000) return interaction.reply("The person you are trying to rob doesn't have 5000 shadebucks. Why are you robbing the poor... you sick bastard.")

		let amount;
        let capAmount = profileData.coins * 20;
		let returnMessage = "";
		var rand = Math.floor(Math.random() * 100) + 1;
        

		if(rand <= 50){
			amount = 0;
			returnMessage = "**LOL** YOU WERE CAUGHT!";
		}else if((rand > 50) && (rand <= 80)){
			amount = Math.floor((userProfileInfo.coins)*0.15);
			returnMessage = "You stole a small portion 💸";
		}else if((rand > 80) && (rand <= 95)){
			amount = Math.floor((userProfileInfo.coins)*0.45);
			returnMessage = "You stole a good chunk! 💰"
		}else {
			amount = Math.floor((userProfileInfo.coins) * 0.99);
			returnMessage = "YOU STOLE BASICALLY EVERYTHING 🤑"
		}

        if(amount > capAmount){
            amount = capAmount;
        }

		if(amount > 0){

            await client.removeCoins(user, amount);
            await client.addCoins(interaction.user, amount);
            returnMessage += `\nYour payout was **${amount}** shadebucks. It pays to be a good thief!`

            client.robnotify(user, interaction.user, amount, true);

		}else{
            await client.addCoins(user, 5000);
            await client.removeCoins(interaction.user, 5000);
            returnMessage += `\nYou paid the person you tried to rob **5000** shadebucks. Maybe learn to rob next time before you do it?`
		}

		return interaction.reply(returnMessage);

    },
};