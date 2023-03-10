const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rsp')
        .setDescription('Let\'s play Rock-Scissors-Paper!'),
    async execute(interection) {
        try {

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('rock')
                        .setLabel('βπ»')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('scissors')
                        .setLabel('βπ»')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('paper')
                        .setLabel('ππ»')
                        .setStyle(ButtonStyle.Secondary),
            );


            const startEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('λ΄κ³Ό νλ κ°μλ°μλ³΄!')
                    .setDescription('μ΄λͺ¨μ§λ₯Ό λλ¬λ³΄μΈμ!');
            const finishEmbed = new EmbedBuilder()
                    .setColor(0x7C7C7C)
                    .setTitle('κ²μμ΄ λλ¬μ΅λλ€!')
                    .setDescription('\'/rsp\' λ₯Ό μλ ₯ν΄μ λ΄κ³Ό κ°μλ°μλ³΄λ₯Ό ν λ² ν΄λ³΄μΈμ!');

    
            // - ephemeral: true => λ©μμ§λ₯Ό λ³΄λΈ μ μ μκ²λ§ λ³΄μ΄λλ‘ μ€μ 
            await interection.reply({ embeds: [startEmbed], components: [row]});


            const filter = (interection) => {
                return interection.customId === 'rock' || 'scissors' || 'paper';
            };

            const collector = interection.channel.createMessageComponentCollector({
                filter,
                time: 4 * 1000, //λͺμ΄λμ λ°μν  μ μλμ§
            });

            const rsp = ['rock', 'scissors', 'paper'];
            const rspEmoji = {'rock': 'βπ»', 'scissors': 'βπ»', 'paper': 'ππ»'};
            let botValue = rsp[Math.floor(Math.random() * 3)];
            
            collector.on('collect', async (interection) => {
                if( // μ μ κ° μ΄κ²Όμ λ
                    (interection.customId === 'rock' && botValue == rsp[1]) ||
                    (interection.customId === 'scissors' && botValue == rsp[2]) ||
                    (interection.customId === 'paper' && botValue == rsp[0])) {
                    const winEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('λΉμ μ μΉλ¦¬μλλ€!')
                        .setDescription(`λΉμ  : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : λ΄`);
                    await interection.reply({ embeds: [winEmbed] });
                } else if( // μ μ κ° μ‘μ λ
                    (interection.customId === 'paper' && botValue == rsp[1]) ||
                    (interection.customId === 'rock' && botValue == rsp[2]) ||
                    (interection.customId === 'scissors' && botValue == rsp[0])) {
                    const loseEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('λΉμ μ ν¨λ°°μλλ€!')
                        .setDescription(`λΉμ  : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : λ΄`);
                    await interection.reply({ embeds: [loseEmbed] });
                } else {
                    const drawEmbed = new EmbedBuilder()
                        .setColor(0x7C7C7C)
                        .setTitle('λΉκ²Όμ΅λλ€!')
                        .setDescription(`λΉμ  : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : λ΄`);
                    await interection.reply({ embeds: [drawEmbed] });
                }
            });

            collector.on('end', async (collect) => {
                await interection.editReply({ embeds: [finishEmbed], components: []});
                // row.components[0].setDisabled(true);
                console.log('μκ° μ΄κ³Ό');
            })

        } catch(error) {
            console.error(error);
        }
    }
};