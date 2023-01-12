const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Get a chance to win a random amount of money!'),
    cooldown: 45000,
    async execute(interaction, client, profileData, workData){

        const choice = (Math.random() * 100)+1;
        var earnedCoins = 0;
        var name = nameArray[Math.floor(Math.random() * nameArray.length)]
        var phrase = "";

        //console.log(choice);

        if(choice <= 0.5){
            earnedCoins = Math.floor(Math.random() * 400) + 800; // 800 - 1200 (0.5% chance)
        }else if((choice >= 0.5) && (choice <= 10)){
            earnedCoins = Math.floor(Math.random() * 300) + 500; // 500 - 800 (9.5% chance)
        }else if((choice >= 10) && (choice <= 30)){
            earnedCoins = Math.floor(Math.random() * 300) + 250; // 200 - 500 (20% chance)
        }else if((choice >= 30) && (choice <= 55)){
            earnedCoins = Math.floor(Math.random() * 200) + 50; // 50 - 250 (25% chance)
        }else{
            earnedCoins = 0; // Failed Beg (45% chance)
        }
        
        await client.addCoins(interaction.member, earnedCoins);

        const embed = new EmbedBuilder()
        .setTitle(name)
        //.setColor("RANDOM")

        if(earnedCoins == 0){
            phrase = noCoinResponse[Math.floor(Math.random() * noCoinResponse.length) + 0];
            embed.setDescription(`"${phrase}"`)
        }else{
            phrase = giveCoinResponse[Math.floor(Math.random() * giveCoinResponse.length) + 0];
            embed.setDescription(`"${phrase} **${earnedCoins} shadebucks**"`)
        }

        interaction.reply( { embeds: [embed] } );

    },
};