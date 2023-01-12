const profileModel = require('../../schemas/profileSchema');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require('@discordjs/builders');
const { ButtonStyle, Events } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('See whats available at your local thrift store!')
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("See what is available in the shop!")
                .addStringOption(option => option.setName("item").setDescription("Item you wish to view specifically")))
        .addSubcommand(subcommand =>
            subcommand
                .setName("buy")
                .setDescription("Buy an item from the shop!")
                .addStringOption(option => {
                    option.setName("item").setDescription("The item you wish to buy").setRequired(true);
                    return option;
                })
                .addStringOption(option => {
                    option.setName("amount").setDescription("Amount of items you want to buy. Has to be less than 100.")
                    return option;
                }))
        .addSubcommand(subcommand =>
            subcommand
                .setName("sell")
                .setDescription("Sell an item in your inventory back to the shop!")
                .addStringOption(option => {
                    option.setName("item").setDescription("The item you wish to sell").setRequired(true);
                    return option;
                })
                .addStringOption(option => {
                    option.setName("amount").setDescription("Amount of items you want to sell. You can type \"max\" to sell as many as you have.")
                    return option;
                })),
                
    cooldown: 3000,
    async execute(interaction, client, profileData, workData){

        let shop_data = JSON.parse(Buffer.from(fs.readFileSync('./src/JSON/shop.json')).toString());

        if(interaction.options.getSubcommand() === "view"){
            const itemName = interaction.options.getString("item");
            if(itemName){

                let temp_items = await Object.keys(shop_data.pages)
                .map(v => shop_data.pages[v].items);
                let items = [];
        
                temp_items.forEach(tmp_items => {
                items = items.concat(tmp_items)
                });
        
                let item = await items.find(v => v.id.includes(itemName.toLocaleLowerCase()));

                if(!item){
                    return interaction.reply("Item was not found.")
                }
                
                let buyTag;
                let sellTag;

                if(item.type == "Collectable"){
                    buyTag = item.cost;
                    sellTag = "Collectables are not able to be sold";
                }else if(item.type == "Sellable"){
                    buyTag = "Not able to be purchased";
                    sellTag = item.sell;
                }else{
                    buyTag = item.cost;
                    sellTag = item.sell;
                }

                var shopInfoEmbed = new EmbedBuilder()
                .setTitle(`${item.name} ${item.image}`)
                .setColor(0x00FF00)
                .setDescription(`
                ${item.description}

                **BUY** - $${buyTag}
                **Sell** - $${sellTag}
                `)
                
                return interaction.reply({embeds: [shopInfoEmbed]})

            }else{
                let index = "1";
                let page = shop_data.pages[index];

                if(!page) {
                    return interaction.reply("An Error Has Occured.")
                }
                
                const shop = new EmbedBuilder()
                .setTitle("Shop Items")
                .setColor(0x0F0F0F);

                for(let item of page.items){
                    if('hidden' in item){
                        if(item.hidden){
                            continue;
                        }
                    }
                    shop.addFields({name: `${item.image} ${item.name} ─ ${(item.cost).toLocaleString() || "Null"}`, value: `*${item.description || "None"}*`});
                }

                const shopListLeftArrow = new ButtonBuilder()
                        .setLabel("️️️⬅️")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('shopListLeftArrow')
                        .setDisabled(true);
                    
                const shopListRightArrow = new ButtonBuilder()
                        .setLabel("➡️")
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId('shopListRightArrow');
                    
                var row = new ActionRowBuilder().addComponents(
                    shopListLeftArrow, shopListRightArrow
                );

                var msg = await interaction.reply({embeds: [shop], components: [row]});

                const filter = i => i.user.id === interaction.member.id;

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 25000 });

                let newShop = shop;

                collector.on('collect', async i => {
                    let id;
                    if (i.user.id === interaction.member.id) {
                        id = i.customId;
                    }else{
                        return
                        //return i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                    }

                    newShop = new EmbedBuilder()
                    .setTitle("Shop Items")
                    .setColor(0x0F0F0F);

                    if(id === 'shopListLeftArrow'){
                        index--;
                        if(index <= 1){
                            shopListLeftArrow.setDisabled(true)
                        }else{
                            shopListRightArrow.setDisabled(false)
                        }
                    }else if(id === 'shopListRightArrow'){
                        index++;
                        if(index >= Object.keys(shop_data.pages).length-1){
                            shopListRightArrow.setDisabled(true)
                        }else{
                            shopListLeftArrow.setDisabled(false)
                        }
                    }

                    row = new ActionRowBuilder().addComponents(
                        shopListLeftArrow, shopListRightArrow
                    );

                    page = shop_data.pages[index];
                    for(let item of page.items){
                        if('hidden' in item){
                            if(item.hidden){
                            continue;
                            }
                        }
                        newShop.addFields({name: `${item.image} ${item.name} ─ ${(item.cost).toLocaleString() || "Null"}`, value: `*${item.description || "None"}*`});
                        }

                    try{
                        await i.update({ embeds: [newShop], components: [row] })

                        i.message.edit({ embeds: [newShop] })
                    }catch(err){
                        console.log(err);
                    }

                })

                collector.on('end', async collected => {
                    shopListLeftArrow.setDisabled(true)
                    shopListRightArrow.setDisabled(true)

                    row = new ActionRowBuilder().addComponents(
                        shopListLeftArrow, shopListRightArrow
                    );
                    interaction.editReply({  embeds: [newShop], components: [row] });

                })
            }

            
        }else if(interaction.options.getSubcommand() === "buy"){

            const itemName = interaction.options.getString("item");

            if(!itemName) return interaction.reply("You good homie? That item isn't even in the shop.")

            let amount = interaction.options.getString("amount") || "1";

            amount = Number(amount);
            
            let inventory_items = profileData.inventory
    
            let temp_items = Object.keys(shop_data.pages)
            .map(v => shop_data.pages[v].items);
            let items = [];
    
            temp_items.forEach(tmp_items => {
            items = items.concat(tmp_items)
            });

            let item = items.find(v => v.id.includes(itemName.toLocaleLowerCase()));

            if(!item){
                return interaction.channel.send("You good homie? That item isn't even in the shop.");
            }

            if (amount > 100){
                return interaction.reply("Please buy less than 100 of one item at a time.")
            }

            if((item.hidden == true) || (item.cost == 0)){
                return interaction.reply("That item can't be bought.")
            }

            let totalCost = (item.cost) * amount

            if((totalCost) > profileData.coins){
                return interaction.reply("Damn you're broke. Make sure you have the money in your wallet if you feel you have enough.");
            } else {
    
                for(let i = 0; i < amount; i++){
                    inventory_items.push(item)
                }
    
                try {    
                    await profileModel.findOneAndUpdate(
                        {
                            userID: interaction.member.id,
                        },
                        {
                            $inc: {
                                coins: -totalCost,
                            },
                            $set: {
                                inventory: inventory_items,
                            }
                        }
                    );

                    let buyEmbed = new EmbedBuilder()
                    .setAuthor({name:`Successful ${item.name} Purchase`, iconURL:`${interaction.member.displayAvatarURL({ dynamic: true, size: 256})}`})
                    .setColor(0x00FF00)
                    if(amount > 1){
                        buyEmbed.setDescription(`<@${interaction.member.id}> bought ${amount.toLocaleString()} **${item.name}**s ${item.image} and paid \`${(totalCost).toLocaleString()}\` shadebucks.`)
                    }else{
                        buyEmbed.setDescription(`<@${interaction.member.id}> bought ${amount.toLocaleString()} **${item.name}** ${item.image} and paid \`${(totalCost).toLocaleString()}\` shadebucks.`)
                    }
                    buyEmbed.setFooter( {text: `Thanks for your $$ lol.`} )
    
                    await interaction.reply({embeds: [buyEmbed]})
    
                } catch (err) {
                    console.log(err);
                }
                
            }
        
        }else if(interaction.options.getSubcommand() === "sell"){
        
            const itemName = interaction.options.getString("item");

            if(!itemName) return interaction.reply("You good homie? That item isn't even in the shop.")

            let amount = interaction.options.getString("amount") || "1";

            let temp_items = profileData.inventory

            let sellingItem = await temp_items.find(v => v.id.includes(itemName.toLocaleLowerCase()));

            if(!sellingItem){
                return interaction.reply("You don't even have the item you are trying to sell! Are you trying to scam the market?")
            }

            if((sellingItem.type == "Collectable") || (sellingItem.sell == 0)){
                return interaction.reply("This item can't be sold.")
            }

            let itemAmount = temp_items.filter(item => (item.id === sellingItem.id)).length;

            if(!amount){
                amount = 1;
            }else{
                if((amount.toLocaleLowerCase() == "max") || (amount.toLocaleLowerCase() == "all")){
                    amount = Number(itemAmount) || 1
                }else{
                    amount = Number(amount) || 1
                }
            }

            if (amount > itemAmount){
                return interaction.reply("You don't have that many! Try selling a smaller portion of that item.")
            }

            if (amount > 100){
                amount = 100;
            }

            let itemSellPrice = Number(sellingItem.sell)

            if(!itemSellPrice){
                return interaction.reply(`This Item Can't Be Sold.`)
            }

            let sellEmbed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Attempted ${sellingItem.name} Sale`)
                .setColor(0xFFFF00)
                .setDescription(`
                **Selling:** ${sellingItem.name} ${sellingItem.image}
                **Amount:** ${(amount).toLocaleString()}
                **Sale Price:** ${(itemSellPrice*amount).toLocaleString()}

                Are you sure you want to sell this item?
                `);

            const sellItemYes = new ButtonBuilder()
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('sellItemYes');
                
            const sellItemNo = new ButtonBuilder()
                    .setLabel("No")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId('sellItemNo');
            
            var row = new ActionRowBuilder().addComponents(
                sellItemYes, sellItemNo
            );

            let confirmed = false;

            let msg = await interaction.reply({ embeds: [sellEmbed], components: [row]})

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

                if(id === 'sellItemYes'){
                    confirmed = true;
                    sellEmbed.setTitle(`${interaction.user.username}'s Successful ${sellingItem.name} Sale`);
                    sellEmbed.setColor(0x00FF00);
                    sellItemNo.setStyle(ButtonStyle.Secondary)
                    sellItemYes.setDisabled(true);
                    sellItemNo.setDisabled(true);
                }else if(id === 'sellItemNo'){
                    confirmed = false;
                    sellEmbed.setTitle(`${interaction.user.username}'s Cancelled ${sellingItem.name} Sale`);
                    sellEmbed.setColor(0xFF0000);
                    sellItemYes.setStyle(ButtonStyle.Secondary)
                    sellItemYes.setDisabled(true);
                    sellItemNo.setDisabled(true);
                }else{
                    return;
                }

                row = new ActionRowBuilder().addComponents(
                    sellItemYes, sellItemNo
                );

                try{
                    await i.update({ embeds: [sellEmbed], components: [row] })
                }catch(err){
                    console.log(err);
                }


            })
            collector.on('end', async collected => {
                
                if(confirmed){

                    let amountEarned = 0;

                    amountEarned = itemSellPrice * amount;

                    for(let i = 0; i < amount; i++){
                        let temp = await temp_items.map(function(x) {return x.id; }).indexOf(sellingItem.id)
                        temp_items.splice(temp, 1)
                    }

                    await profileModel.findOneAndUpdate(
                        {
                            userID: interaction.member.id,
                        },
                        {
                            $inc: {
                                coins: amountEarned,
                            },
                            $set: {
                                inventory: temp_items,
                            },
                        }
                    );

                    return interaction.editReply({embeds: [sellEmbed], components: [row]});



                }else{
                    if(collected.size <= 0){
                        sellEmbed.setTitle('No Response To Action');
                        sellEmbed.setColor(0xFFFF00);
                    }
                    sellItemYes.setDisabled(true);
                    sellItemNo.setDisabled(true);

                    row = new ActionRowBuilder().addComponents(
                        sellItemYes, sellItemNo
                    );

                    return interaction.editReply({embeds: [sellEmbed], components: [row]});
                    // i.message.edit({ embeds: [embed] })
                }
            })



        }else {

            await interaction.reply("No sub command was used.");
        
        }
    },
};