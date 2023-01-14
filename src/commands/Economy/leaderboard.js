const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who the rich people are!'),
    cooldown: 10000,
    async execute(interaction, client, profileData, workData){

        //return interaction.reply("This command is a work in progress.");

        const sortedCollection = await profileModel.find().sort({ coins: -1 }).catch(e => console.log(e));

        const embed = new EmbedBuilder()
        .setTitle("Richest Users According To Wallet Size")
        //.setColor("RANDOM")

        //console.log(await client.users.fetch(sortedCollection[0].userID));

        try{
            embed.setDescription(`
            🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${(await client.users.fetch(sortedCollection[0].userID)).username}#${(await client.users.fetch(sortedCollection[0].userID)).discriminator}
            🥈**${(sortedCollection[1]).coins.toLocaleString()}** - ${(await client.users.fetch(sortedCollection[1].userID)).username}#${(await client.users.fetch(sortedCollection[1].userID)).discriminator}
            🥉**${(sortedCollection[2]).coins.toLocaleString()}** - ${(await client.users.fetch(sortedCollection[2].userID)).username}#${(await client.users.fetch(sortedCollection[2].userID)).discriminator}
            🔸**${(sortedCollection[3]).coins.toLocaleString()}** - ${(await client.users.fetch(sortedCollection[3].userID)).username}#${(await client.users.fetch(sortedCollection[3].userID)).discriminator}
            🔸**${(sortedCollection[4]).coins.toLocaleString()}** - ${(await client.users.fetch(sortedCollection[4].userID)).username}#${(await client.users.fetch(sortedCollection[4].userID)).discriminator}
            `)
        }catch(err){
            console.log("Leaderboard: " + err);
        }
        
        interaction.reply( { embeds: [embed] } );
    },
};