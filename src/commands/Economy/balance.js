const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Returns user\'s balance.'),
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("user")
        //         .setDescription("Gets information of a user mentioned")
        //         .addUserOption(option => option.setName("target").setDescription("The user mentiond"))),
    async execute(interaction, client, profileData){
        
        const user = (interaction.options.getUser("target") ? interaction.options.getUser("target") : interaction.user);

        const embed = new EmbedBuilder()
        .setAuthor({ name:`${user.username}'s Balance`, iconURL:`${user.displayAvatarURL({ dynamic: true, size: 256})}`})
        .setDescription(`
        💰Wallet: ${(profileData.coins).toLocaleString()}
        💰Bank: ${(profileData.bank).toLocaleString()} /  ${(profileData.bankMax).toLocaleString()}
        `)
        .setColor(0x00FF00)

        await interaction.reply({ embeds: [embed] });


        

    },
};