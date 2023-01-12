const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snakeeyes')
        .setDescription('How\'s your luck with rolling some die?')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to gamble. Enter \"max\" to gamble all.").setRequired(true)),
    cooldown: 10000,
    async execute(interaction, client, profileData, workData){
        let bet = interaction.options.getString("amount");

        if(bet == "max"){
            bet = profileData.coins;
        }

        if (isNaN(bet)) {
            return interaction.reply('You need to bet a real number')
        }

        bet = Number(bet)
        bet = Math.round(bet)
        
        if (bet < 1) {
            return interaction.reply('You need to gamble SOME money.')
        }
      
        if (bet > profileData.coins) {
            return interaction.reply(`I think we both know you aren't that rich..`)
        }

        let multiplier;
        let winnings;


        let snakeRoll = new EmbedBuilder()
        .setAuthor({name:`${interaction.user.username}'s Snake Eyes Game`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 256})}`})
        .setDescription(`
        <a:roll:904513024478568458> <a:roll:904513024478568458>
        `)

        let dice1 = Math.floor(Math.random()*6)+1;
        let dice2 = Math.floor(Math.random()*6)+1;
        
        let d1 = "<:d1:904513111590051840>"
        let d2 = "<:d2:904513129654935593>"
        let d3 = "<:d3:904513206280650762>"
        let d4 = "<:d4:904513218578358292>"
        let d5 = "<:d5:904513244411093002>"
        let d6 = "<:d6:904513269761454100>"

        let face1;
        let face2;

        switch(dice1){
            case 1:
                face1 = d1;
                break;
            case 2:
                face1 = d2;
                break;
            case 3:
                face1 = d3;
                break;
            case 4:
                face1 = d4;
                break;
            case 5:
                face1 = d5;
                break;
            case 6:
                face1 = d6;
                break;
        }
        switch(dice2){
            case 1:
                face2 = d1;
                break;
            case 2:
                face2 = d2;
                break;
            case 3:
                face2 = d3;
                break;
            case 4:
                face2 = d4;
                break;
            case 5:
                face2 = d5;
                break;
            case 6:
                face2 = d6;
                break;
        }

        let snakeFinal = new EmbedBuilder()
        .setAuthor({name:`${interaction.user.username}'s Snake Eyes Game`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 256})}`})
        
        if(dice1 == 1 && dice2 == 1){
            winnings = Math.round(bet * 5)
            snakeFinal.setDescription(`
            ${face1} ${face2}
            SNAKE EYES! You were actually lucky for once??? What the heck? You earned **5x** your bet: **${winnings.toLocaleString()}** shadebucks
            `)
        }else if(dice1 == 1 && dice2 != 1){
            winnings = Math.round(bet * 1.5)
            snakeFinal.setDescription(`
            ${face1} ${face2}
            One eye? Not bad. You earned **1.5x** your bet: **${winnings.toLocaleString()}** shadebucks
            `)
        
        }else if(dice1 != 1 && dice2 == 1){
            winnings = Math.round(bet * 1.5)
            snakeFinal.setDescription(`
            ${face1} ${face2}
            One eye? Not bad. You earned **1.5x** your bet: **${winnings.toLocaleString()}** shadebucks
            `)
        }else{
            winnings = bet * -1;
            snakeFinal.setDescription(`
            ${face1} ${face2}
            Dang you got no eyes? Just like my teama-. Nevermind. You earned nothing (obviously).
            `)
        }

        let msg = await interaction.reply({embeds: [snakeRoll]})

        setTimeout(function(){
            interaction.editReply({embeds: [snakeFinal]});
            client.addCoins(interaction.member, winnings)
        }, 3500)
    },
};