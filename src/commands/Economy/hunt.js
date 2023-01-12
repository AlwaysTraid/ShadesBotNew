const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hunt')
        .setDescription('Maybe you\'ll get lucky enough to bring back a prized pelt?'),
    cooldown: 40000,
    async execute(interaction, client, profileData, workData){

        let huntingrifle = profileData.inventory.find(element => element.name == "Hunting Rifle")

        if(!huntingrifle){
            return interaction.reply(`You don't have a Hunting Rifle. You need to go buy one in the shop. Why would you go hunting with your bare hands?`)
        }

        let shop_data = JSON.parse(Buffer.from(fs.readFileSync('./src/JSON/shop.json')).toString());

        let temp_items = Object.keys(shop_data.pages)
        .map(v => shop_data.pages[v].items);
        let items = [];

        temp_items.forEach(tmp_items => {
        items = items.concat(tmp_items)
        });

        let animalFound;

        let temp_usedItems = profileData.activeItems
        let huntingBuff = await temp_usedItems.find(v => v.id.includes("beartrap"));

        let rand = (Math.random()*100)+1
        rand = Math.round(rand *10) / 10

        if(huntingBuff){
            if(rand < 46){
                rand = rand + 46;
            }
        }

        if((rand > 46) && (rand <= 80)){
            animalFound = "Skunk";
        }else if((rand > 80) && (rand <= 90)){
            animalFound = "Rabbit";
        }else if((rand > 90) && (rand <= 95)){
            animalFound = "Duck";
        }else if((rand > 95) && (rand <= 97.5)){
            animalFound = "Deer";
        }else if((rand > 97.5) && (rand <= 99.5)){
            animalFound = "Boar";
        }else if((rand > 99.5) && (rand <= 100)){
            animalFound = "Dragon";
        }

        let animalFoundObject = await items.find(element => element.name == animalFound)

        if (animalFoundObject){
            await profileModel.findOneAndUpdate(
                {
                    userID: interaction.member.id,
                },
                {
                    $push: {
                        inventory: animalFoundObject,
                    },
                }
            );
        }
        
        if(!animalFoundObject){
            animalFound = "NOTHING";
        }

        if(animalFound == "NOTHING"){
            return interaction.reply("You went hunting in the woods and found NOTHING! Better luck next time!");
        }else if(animalFound != "Dragon"){
            return interaction.reply(`You went hunting in the woods and found a ${animalFound} ${animalFoundObject.image}!`);
        }else{
            return interaction.reply(`You decided to go to a different spot for hunting today and found a ${animalFound} ${animalFoundObject.image}!!! What the hell???`);

        }

    },
};