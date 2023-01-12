const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('See who the rich people are!'),
    cooldown: 10000,
    async execute(interaction, client, profileData, workData){

        return interaction.reply("This command is a work in progress.");

        // console.log(interaction.guild.id)
        // const sortedCollection = await (await profileModel.find().sort({ coins: -1 })).filter({ guildID: interaction.guild.id}).catch(e => console.log(e));

        // const embed = new EmbedBuilder()
        // .setTitle("Richest Users According To Wallet Size")
        // //.setColor("RANDOM")

        // console.log(sortedCollection);

        // const membercount = client.guilds.cache.get(interaction.member.guild.id).memberCount;
        // switch(sortedCollection.length){
        //     case 1:
        //         embed.setDescription(`
        //         🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[0].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[0].userID).discriminator}
        //         `)
        //         break;
        //     case 2:  
        //         embed.setDescription(`
        //         🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[0].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[0].userID).discriminator}
        //         🥈**${(sortedCollection[1]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[1].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[1].userID).discriminator}
        //         `)
        //         break;
        //     case 3:  
        //         embed.setDescription(`
        //         🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[0].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[0].userID).discriminator}
        //         🥈**${(sortedCollection[1]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[1].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[1].userID).discriminator}
        //         🥉**${(sortedCollection[2]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[2].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[2].userID).discriminator}
        //         `)
        //         break;
        //     case 4:
        //         embed.setDescription(`
        //         🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[0].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[0].userID).discriminator}
        //         🥈**${(sortedCollection[1]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[1].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[1].userID).discriminator}
        //         🥉**${(sortedCollection[2]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[2].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[2].userID).discriminator}
        //         🔸**${(sortedCollection[3]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[3].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[3].userID).discriminator}
        //         `)
        //         break;
        //     default:
        //         embed.setDescription(`
        //         🥇**${(sortedCollection[0]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[0].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[0].userID).discriminator}
        //         🥈**${(sortedCollection[1]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[1].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[1].userID).discriminator}
        //         🥉**${(sortedCollection[2]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[2].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[2].userID).discriminator}
        //         🔸**${(sortedCollection[3]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[3].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[3].userID).discriminator}
        //         🔸**${(sortedCollection[4]).coins.toLocaleString()}** - ${client.users.cache.find(user => user.id === sortedCollection[4].userID).username}#${client.users.cache.find(user => user.id === sortedCollection[4].userID).discriminator}
        //         `)
        //         break;
        // }
        // interaction.reply( { embeds: [embed] } );
    },
};