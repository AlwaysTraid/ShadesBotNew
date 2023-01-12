const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamble')
        .setDescription('Gamble your problems away!')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to gamble. Enter \"max\" to gamble all.").setRequired(true)),
    cooldown: 8000,
    async execute(interaction, client, profileData, workData){

        let amount = interaction.options.getString("amount");

        if(amount == "max"){
            amount = profileData.coins;
        }

        if (isNaN(amount)) {
            return interaction.reply('You need to bet a real number')
        }

        amount = Number(amount)
        amount = Math.round(amount)
        
        if (amount < 1) {
            return interaction.reply('You need to gamble SOME money.')
        }
      
        if (amount > profileData.coins) {
            return interaction.reply(`I think we both know you aren't that rich..`)
        }

        const yourRoll = Math.floor(Math.random()*100)+1;
        const botRoll = Math.floor(Math.random()*100)+1;
        var factor = "";
        var winnings = 0;

        if(yourRoll > botRoll){
            factor = "winning";
            winnings = amount;
        }else if(yourRoll < botRoll){
            factor = "losing";
            winnings = amount*-1
        }else{
            factor = "tie";
        }

        const embed = new EmbedBuilder()
        .setAuthor({ name:`${interaction.user.username}'s ${factor} gambling game`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 256})}`})
        
        await client.addCoins(interaction.member, winnings);
        
        
        // try{
        //     await profileModel.findOneAndUpdate(
        //     {
        //         userID: interaction.member.id,
        //     },
        //     {
        //         $inc: {
        //             coins: winnings,
        //         },
        //     });
            

        // }catch(err) {
        //     console.log(err);
        // }
        
        profileData = await profileModel.findOne({ userID: interaction.member.id });
        if(factor == "winning"){
            embed.setDescription(
                `
                You won **${amount}** shadebucks

                **New Balance**: ${profileData.coins} shadebucks
                
                `)
            embed.setColor(0x00FF00)
            embed.addFields(
                { name: `**${interaction.user.username}**`, value: `Rolled \`${yourRoll}\``, inline: true },
		        { name: `**Shades Bot**`, value: `Rolled \`${botRoll}\``, inline: true },
            );
        }
        else if(factor == "losing"){
            embed.setDescription(
                `
                You lost **${amount}** shadebucks

                **New Balance**: ${profileData.coins} shadebucks
                
                `)
            embed.setColor(0xFF0000)
            embed.addFields(
                { name: `**${interaction.user.username}**`, value: `Rolled \`${yourRoll}\``, inline: true },
		        { name: `**Shades Bot**`, value: `Rolled \`${botRoll}\``, inline: true },
            );
        }
        else{
            embed.setDescription(
                `
                You tied and didn't have a change of balance

                **Balance**: ${profileData.coins} shadebucks
                
                `)
            embed.setColor(0x0000FF)
            embed.addFields(
                { name: `**${interaction.user.username}**`, value: `Rolled \`${yourRoll}\``, inline: true },
		        { name: `**Shades Bot**`, value: `Rolled \`${botRoll}\``, inline: true },
            );
        }

        interaction.reply( { embeds: [embed] } );


    },
};