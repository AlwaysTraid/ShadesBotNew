const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw your shadebucks from the bank!')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to withdraw. Enter \"max\" to withdraw all.").setRequired(true)),
    cooldown: 5000,
    async execute(interaction, client, profileData, workData){

        let amount = interaction.options.getString("amount");
        //var amount = args[1];

        if(amount == "max"){
            amount = profileData.bank;
        }

        amount = Number(amount)
        amount = Math.round(amount)
        if (amount % 1 != 0 || amount <= 0) return interaction.reply("You can only withdraw money from this bank, idiot.");
        
        if (amount > profileData.bank) return interaction.reply(`You ain't that rich bud..`);
        
        await client.addCoins(interaction.member, amount);
        await client.removeBank(interaction.member, amount);

        profileData = await profileModel.findOne({ userID: interaction.member.id });
        return interaction.reply(`You withdrew **${(amount).toLocaleString()}** shadebucks from your bank. Current balance in wallet is **${(profileData.coins).toLocaleString()}** shadebucks.`);
        
    },
};