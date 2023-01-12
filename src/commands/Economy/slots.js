const profileModel = require('../../schemas/profileSchema');
const { nameArray, giveCoinResponse, noCoinResponse } = require('../../Arrays/begArray')
const { SlashCommandBuilder, EmbedBuilder} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Gamble while playing slots!')
        .addStringOption(option => option.setName("amount").setDescription("Amount of shadesbucks you want to gamble. Enter \"max\" to gamble all.").setRequired(true)),
    cooldown: 5000,
    async execute(interaction, client, profileData, workData){

        const emotes = [':tangerine:', ':watermelon:', ':pear:', ':grapes:', ':cherries:', ':banana:', ':seven:']
        let slotsNums = []
        let random
        let slotString = '**[:slot_machine: l SLOTS ]\n-----------------\n**'
        let bet = interaction.options.getString("amount");
        if(bet == "max"){
            bet = profileData.coins;
        }

        if (isNaN(bet)) {
            return interaction.reply('You need to bet a real number')
        }

        bet = Number(bet)
        bet = Math.round(bet)
        let winnings
        let result
        let count
    
        if (bet < 1) {
          return interaction.reply('You need to bet SOME money.')
        }
    
        if (bet > profileData.coins) {
          return interaction.reply(`I think we both know you aren't that rich..`)
        }
    
        for (count = 0; count < 9; count++) {
          random = emotes[Math.floor(Math.random() * emotes.length)]
          slotsNums.push(random)
          slotString += slotsNums[count] + ' '
    
          if (count === 2 || count === 5 || count === 8) {
            if (count === 5) { slotString += '**<<<**' }
            slotString += '\n'
          } else {
            slotString += ': '
          }
        }
        slotString += '**-----------------**\n'
        if (slotsNums[3] === slotsNums[4] && slotsNums[3] === slotsNums[5] && slotsNums[4] === slotsNums[5]) {
          slotString += '**| : : : WIN : : : |**'
          winnings = bet * 3
          result = `THREE MATCHES! You've tripled your bet`
          await client.addCoins(interaction.member, winnings)
        } else if (slotsNums[3] === slotsNums[4] || slotsNums[3] === slotsNums[5] || slotsNums[4] === slotsNums[5]) {
          slotString += '**| : : : WIN : : : |**'
          winnings = bet * 2
          result = `Two matches! You've doubled your bet`
          await client.addCoins(interaction.member, winnings)
        } else {
          slotString += '**| : : : LOSS : : : |**'
          winnings = bet * 0
          result = `No matches... You've lost`
          await client.removeCoins(interaction.member, bet)
        }
    
        return interaction.reply(`${slotString}\n\n${result} and won ${winnings} coins.`)



    },
};