const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Maybe you get some goods while fishing?'),
    cooldown: 40000,
    async execute(interaction, client, profileData, workData){
    
        let fishingrod = profileData.inventory.find(element => element.name == "Fishing Rod")

        if(!fishingrod){
            return interaction.reply(`You don't have a Fishing Rod. You need to go buy one in the shop. Why would you go fishing with your bare hands?`)
        }

        let temp_usedItems = profileData.activeItems

        let fishingBuff = await temp_usedItems.find(v => v.id.includes("fishingbait"));

        let shop_data = JSON.parse(Buffer.from(fs.readFileSync('./src/JSON/shop.json')).toString());

        let temp_items = Object.keys(shop_data.pages)
        .map(v => shop_data.pages[v].items);
        let items = [];

        temp_items.forEach(tmp_items => {
        items = items.concat(tmp_items)
        });

        let itemFound;

        let rand = (Math.random()*100)+1
        rand = Math.round(rand *10) / 10

        if(fishingBuff){
            if(rand < 43){
                rand = rand + 43;
            }
        }

        let lowTier = ["Common Fish", "Seaweed", "Garbage"];
        let mediumTier = ["Decent Fish", "Fishing Rod"];
        let highTier = ["Exotic Fish", "Jelly Fish", "Bank Note"];
        let legendaryTier = ["Kraken"]

        if((rand > 43) && (rand <= 80)){
            itemFound = await client.randomInArray(lowTier);
        }else if((rand > 80) && (rand <= 96)){
            itemFound = await client.randomInArray(mediumTier);
        }else if((rand > 96) && (rand <= 99.8)){
            itemFound = await client.randomInArray(highTier);
        }else if((rand > 99.8) && (rand <= 100)){
            itemFound = await client.randomInArray(legendaryTier);
        }

        let itemFoundObject = await items.find(element => element.name == itemFound)

        if (itemFoundObject){
            await profileModel.findOneAndUpdate(
                {
                    userID: interaction.member.id,
                },
                {
                    $push: {
                        inventory: itemFoundObject,
                    },
                }
            );
        }
        
        if(!itemFoundObject){
            itemFound = "NOTHING";
        }

        if(itemFound == "NOTHING"){
            return interaction.reply("You went fishing at the nearest pond and found NOTHING! Better luck next time!");
        }else if(itemFound != "Kraken"){
            return interaction.reply(`You went fishing at the nearest pond and found a ${itemFound} ${itemFoundObject.image}!`);
        }else{
            return interaction.reply(`You decided to go to the ocean for fishing today and found a ${itemFound} ${itemFoundObject.image}!!! What the hell???`);
        }
    
    },
};