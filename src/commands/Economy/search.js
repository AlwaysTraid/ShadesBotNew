const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { places } = require('../../Arrays/searchArray');
const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
        
module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for valuables or money with minimal risk.'),
    cooldown: 1000,
    async execute(interaction, client, profileData, workData){
        
        const chosenLocations = places.sort(() => Math.random() - Math.random()).slice(0, 3);

        const searchChoice0 = new ButtonBuilder()
                .setLabel(chosenLocations[0][0])
                .setStyle(ButtonStyle.Primary)
                .setCustomId('searchChoice0')
            
        const searchChoice1 = new ButtonBuilder()
                .setLabel(chosenLocations[1][0])
                .setStyle(ButtonStyle.Primary)
                .setCustomId('searchChoice1')

        const searchChoice2 = new ButtonBuilder()
                .setLabel(chosenLocations[2][0])
                .setStyle(ButtonStyle.Primary)
                .setCustomId('searchChoice2')

        var row = new ActionRowBuilder().addComponents(
            searchChoice0, searchChoice1, searchChoice2
        );
        var msg = await interaction.reply({
            content: "Where do you want to search? \n*Click a button below to make a choice!*",
            components: [row],
        });

        var placeName = "";
        var earnings = 0;
        var deathChance = 0;
        var winSaying = "";
        var deathSaying = "";
        var died = false;


        var embed = new EmbedBuilder()
        .setColor(0xFFFF00)

        const filter = i => i.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time: 15000 });

        collector.on('collect', async i => {
            let id;
            if (i.user.id === interaction.member.id) {
                id = i.customId;
            }else{
                return
                //i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
            }
            
            if(id === 'searchChoice0'){
                placeName = chosenLocations[0][0];
                earnings = Math.floor(Math.random() * (parseInt(chosenLocations[0][6]) - parseInt(chosenLocations[0][5]))) + parseInt(chosenLocations[0][5]);
                deathChance = parseInt(chosenLocations[0][4]);
                winSaying = chosenLocations[0][2];
                deathSaying = chosenLocations[0][3];

                searchChoice1.setStyle(ButtonStyle.Secondary);
                searchChoice2.setStyle(ButtonStyle.Secondary);
                searchChoice0.setDisabled(true);
                searchChoice1.setDisabled(true);
                searchChoice2.setDisabled(true);

            }else if(id === 'searchChoice1'){
                placeName = chosenLocations[1][0];
                earnings = Math.floor(Math.random() * (parseInt(chosenLocations[1][6]) - parseInt(chosenLocations[1][5]))) + parseInt(chosenLocations[1][5]);
                deathChance = parseInt(chosenLocations[1][4]);
                winSaying = chosenLocations[1][2];
                deathSaying = chosenLocations[1][3];

                searchChoice0.setStyle(ButtonStyle.Secondary);
                searchChoice2.setStyle(ButtonStyle.Secondary);
                searchChoice0.setDisabled(true);
                searchChoice1.setDisabled(true);
                searchChoice2.setDisabled(true);
                
            }else if(id === 'searchChoice2'){
                placeName = chosenLocations[2][0];
                earnings = Math.floor(Math.random() * (parseInt(chosenLocations[2][6]) - parseInt(chosenLocations[2][5]))) + parseInt(chosenLocations[2][5]);
                deathChance = parseInt(chosenLocations[2][4]);
                winSaying = chosenLocations[2][2];
                deathSaying = chosenLocations[2][3];

                searchChoice0.setStyle(ButtonStyle.Secondary);
                searchChoice1.setStyle(ButtonStyle.Secondary);
                searchChoice0.setDisabled(true);
                searchChoice1.setDisabled(true);
                searchChoice2.setDisabled(true);
            }else{
                return;
            }

            row = new ActionRowBuilder().addComponents(
                searchChoice0, searchChoice1, searchChoice2
            );

            try{
                await i.update({ content: "Where do you want to search? \n*Click a button below to make a choice!*", components: [row] })
            }catch(err){
                console.log(err);
            }
            

            embed.setTitle(`${interaction.user.username} searched the ${placeName}`)
            //deathChance = 100;
            var rand = Math.floor(Math.random() * 100) + 1;
            if (rand <= deathChance){
                //console.log(rand + " " + deathChance)
                died = true;
            }

            if(died){
                embed.setDescription(`${deathSaying} You died.`)

                let ifDied = await client.death(interaction.member, profileData);
                let deathEmbed;

                if(ifDied){
                    //console.log("True")
                    deathEmbed = new EmbedBuilder()
                    .setTitle("You Died")
                    .setColor(0xFF0000)
                    .setDescription("Since you didn't have a lifesaver, you couldn't be saved when you were taken to the doctors. Try buying a lifesaver before you die next time! You lost a majority of your shadebucks as well as some items. Stay safe out there!")
                    interaction.channel.send({embeds: [deathEmbed]})
                }else{
                    //console.log("False")
                    deathEmbed = new EmbedBuilder()
                    .setTitle("Woah! You almost died.")
                    .setColor(0x00FF00)
                    .setDescription("Since you had a lifesaver, you were saved by the doctors and avoided losing your money and items! They believe you were smart to be carrying that around you in your pocket. Your lifesaver was consumed upon death. Stay safe out there!")
                    interaction.channel.send({embeds: [deathEmbed]})
                }
            }else{
                client.addCoins(interaction.member, earnings)
                embed.setDescription(`You found **${(earnings).toLocaleString()}** shadebucks! ${winSaying}`);
            }
            
            i.message.edit({ embeds: [embed] })
            
        })

        collector.on('end', async collected => {
            if(collected.size <= 0){
                searchChoice0.setDisabled(true)
                searchChoice1.setDisabled(true)
                searchChoice2.setDisabled(true)
                row = new ActionRowBuilder().addComponents(
                    searchChoice0, searchChoice1, searchChoice2
                );
                interaction.editReply({content: "Guess you didn't want to search anywhere", components: [row]})
            }

        })



    },
};