
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client){
        if(!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        await client.addCommandCount(interaction.member);

        let profileData = await client.findProfile(interaction.member);
        let workData = await client.findWork(interaction.member);

        //console.log(profileData.commandCount)


        let cooldownCheck = await client.checkCooldown(interaction.member, command, interaction);

        try{
            if(cooldownCheck){
                await command.execute(interaction, client, profileData, workData);
            }   
        }catch(error){
            console.error(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true
            });
        }
    },
};