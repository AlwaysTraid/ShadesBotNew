const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('scratch')
        .setDescription('Scratch tickets for money!')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to gamble. Enter \"max\" to gamble all.").setRequired(true)),
    cooldown: 10000,
    async execute(interaction, client, profileData, workData){

        // if (isNaN(args[1])) {
        //     return message.reply('You need to bet a real number')
        // }

        // let amount = Number(args[1])
        // amount = Math.round(amount)
        
        // if (amount < 1) {
        //     return message.reply('You need tamount SOME money.')
        // }
      
        // if (amount > profileData.coins) {
        //     return message.reply(`I think we both know you aren't that rich..`)
        // }

        // var scratchEmbed = new EmbedBuilder()
        // .setTitle(message.author.username + "'s Scratch-Off")
        
        // const scratchone = new ButtonBuilder()
        //     .setLabel("️️️ ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchone')
        // const scratchtwo = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchtwo');
        // const scratchthree = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchthree');
        // const scratchfour = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchfour');
        // const scratchfive = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchfive');
        // const scratchsix = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchsix');
        // const scratchseven = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchseven');
        // const scratcheight = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratcheight');
        // const scratchnine = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchnine');
        // const scratchten = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchten');
        // const scratcheleven = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratcheleven');
        // const scratchtwelve = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchtwelve');
        // const scratchthirteen = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchthirteen');
        // const scratchfourteen = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchfourteen');
        // const scratchfifteen = new ButtonBuilder()
        //     .setLabel(" ")
        //     .setStyle(ButtonStyle.Secondary)
        //     .setCustomId('scratchfifteen');
            
        // var row1 = new ActionRowBuilder().addComponents(
        //     scratchone, scratchtwo, scratchthree
        // );

        // var row2 = new ActionRowBuilder().addComponents(
        //     scratchfour, scratchfive, scratchsix
        // );

        // var row3 = new ActionRowBuilder().addComponents(
        //     scratchseven, scratcheight, scratchnine
        // );

        // var row4 = new ActionRowBuilder().addComponents(
        //     scratchten, scratcheleven, scratchtwelve
        // );

        // var row5 = new ActionRowBuilder().addComponents(
        //     scratchthirteen, scratchfourteen, scratchfifteen
        // );

        interaction.reply('This is a work in progress');

        // var msg = await message.reply({embeds: [scratchEmbed], components: [
        //     row1, row2, row3, row4, row5
        // ]});

    },
};