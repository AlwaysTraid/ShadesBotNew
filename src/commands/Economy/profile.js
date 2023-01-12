const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('See a user\'s profile. Leave blank if you want to see your own.')
        .addUserOption(option => option.setName("target").setDescription("The user who's profile you want to see")),
                
    cooldown: 3000,
    async execute(interaction, client, profileData, workData){

        let user = interaction.options.getUser("target");
        if (!user) {
            user = interaction.user;
        }

        let userProfileInfo = await client.findProfile(user)

        if(!userProfileInfo) return interaction.reply("User is undocumented. Ask them to do a command so I can find information on them.")

        return interaction.reply("This is currently a work in progress");
        
        //let embed = EmbedBuilder()

    },
};