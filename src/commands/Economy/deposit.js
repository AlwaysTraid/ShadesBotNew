const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('Deposit your hard earned money into the bank!')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to deposit. Enter \"max\" for max amount possible.").setRequired(true)),
    cooldown: 5000,
    async execute(interaction, client, profileData, workData){

        let amount = interaction.options.getString("amount");
        //var amount = args[1];

        if(amount == "max"){
            let space = profileData.bankMax - profileData.bank;
            if(space > 0){
                if(profileData.coins > space){
                    amount = space;
                }else{
                    amount = profileData.coins;
                }
            }else{
                return interaction.reply(`You can't deposit more than **${profileData.bankMax}**. To hold more, you need to level up more.`);
            }
        }

        if (amount % 1 != 0 || amount <= 0) return interaction.reply("You can only deposit money in this bank, idiot.");
        amount = Number(amount)
        amount = Math.round(amount)
        try {
          if (amount > profileData.coins) return interaction.reply(`You ain't that rich bud..`);
          if ((amount + profileData.bank) > profileData.bankMax) return interaction.reply(`You can't deposit more than **${profileData.bankMax}**. To hold more, you need to level up more.`)
          
          await client.removeCoins(interaction.member, amount);
          await client.addBank(interaction.member, amount);
          
          // await profileModel.findOneAndUpdate(
          //   {
          //     userID: interaction.member.id,
          //   },
          //   {
          //     $inc: {
          //       coins: -amount,
          //       bank: amount,
          //     },
          //   }
          // );
          profileData = await profileModel.findOne({ userID: interaction.member.id });
    
          return interaction.reply(`You deposited **${(amount).toLocaleString()}** shadebucks into your bank. Current balance in bank is **${(profileData.bank).toLocaleString()}** shadebucks.`);
        } catch (err) {
          console.log(err);
        }
    },
};