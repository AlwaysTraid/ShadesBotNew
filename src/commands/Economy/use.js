const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Use items to gain special perks and benefits for certain time limits or permanently!')
        .addStringOption(option => option.setName("item").setDescription("Item you wish to use").setRequired(true)),
                
    cooldown: 5000,
    async execute(interaction, client, profileData, workData){

        const itemName = interaction.options.getString("item");

        if(!itemName) return interaction.reply(`What are you trying to use? Air?`);

        let temp_items = profileData.inventory

        let item = await temp_items.find(v => v.id.includes(itemName));

        if(!item){
            return interaction.reply("Why are you trying to use an item that you don't have?")
        }

        if(!item.useable){
            return interaction.reply("That item isn't useable! <:Kappa:895793170716192819>");
        }

        let temp_usedItems = profileData.activeItems
        let existingBuff = await temp_usedItems.find(v => v.id.includes(item.id))

        if(existingBuff){
            return interaction.reply("You already have this item effects on you. Try again later.")
        }

        return interaction.reply("This is currently a work in progress");

        // if(item.time){
        //     if(item.time < 0){
        //         //Do Something Here
        //     }else{

        //         let temp = await temp_items.map(function(x) {return x.id; }).indexOf(item.id)
        //         await temp_items.splice(temp, 1)

        //         let itemUsed = {
        //             name: item.name,
        //             id: item.id,
        //             description: item.description,
        //             image: item.image,
        //             time: ((item.time) + Date.now())
        //         }

        //         try{

        //             await profileModel.findOneAndUpdate(
        //                 {
        //                     userID: message.author.id,
        //                 },
        //                 {
        //                     $push: {
        //                         activeItems: itemUsed,
        //                     },
        //                     $set: {
        //                         inventory: temp_items,
        //                     }
        //                 }
        //             );

        //         } catch (err) {
        //             console.log(err);
        //         }

        //         let useEmbed = new Discord.MessageEmbed()
        //         .setTitle("Item Used")
        //         .setDescription(`You have successfully used a **${item.name}**. You have **${msToTime(item.time)}** left before it expires.`)
        //         .setColor("RANDOM")

        //         return message.reply({embeds: [useEmbed]});
        //     }
        // }else{
        //     return message.reply("That item isn't useable! <:Kappa:895793170716192819>")
        // }

    },
};