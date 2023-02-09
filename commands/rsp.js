const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rsp')
        .setDescription('Let\'s play Rock-Scissors-Paper!'),
    async execute(interection) {
        try {
            const buttonsInfo = [
                {
                    customId: 'rock',
                    label: '✊🏻',
                    style: 'Secondary',
                },
                {
                    customId: 'scissors',
                    label: '✌🏻',
                    style: 'Secondary',
                },
                {
                    customId: 'paper',
                    label: '🖐🏻',
                    style: 'Secondary',
                },
            ]
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('rock')
                        .setLabel('✊🏻')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('scissors')
                        .setLabel('✌🏻')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('paper')
                        .setLabel('🖐🏻')
                        .setStyle(ButtonStyle.Primary),
                );
            const mainEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('봇과 하는 가위바위보!')
                    .setDescription('이모지를 눌러보세요!');
            // - ephemeral: true => 메시지를 보낸 유저에게만 보이도록 설정
            await interection.reply({ embeds: [mainEmbed], components: [row]});

            const filter = (interection) => {
                return interection.customId === 'rock' || 'scissors' || 'paper';
            };
            const collector = interection.channel.createMessageComponentCollector({
                filter,
                // time: 10 * 1000, //몇초동안 반응할 수 있는지
            });
            const rsp = ['rock', 'scissors', 'paper'];
            const rspEmoji = {'rock': '✊🏻', 'scissors': '✌🏻', 'paper': '🖐🏻'};
            let botValue = rsp[Math.floor(Math.random() * 3)];
            collector.on('collect', async (interection) => {
                if( // 유저가 이겼을 때
                    (interection.customId === 'rock' && botValue == rsp[1]) ||
                    (interection.customId === 'scissors' && botValue == rsp[2]) ||
                    (interection.customId === 'paper' && botValue == rsp[0])) {
                    const winEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('당신의 승리입니다!')
                        .setDescription(`당신 : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : 봇`);
                    await interection.reply({ embeds: [winEmbed] });
                } else if( // 유저가 졌을 때
                    (botValue == rsp[1] && interection.customId === 'rock') ||
                    (botValue == rsp[2] && interection.customId === 'scissors') ||
                    (botValue == rsp[0] && interection.customId === 'paper')) {
                    const loseEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('당신의 패배입니다!')
                        .setDescription(`당신 : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : 봇`);
                    await interection.reply({ embeds: [loseEmbed] });
                } else {
                    const drawEmbed = new EmbedBuilder()
                        .setColor(0x7C7C7C)
                        .setTitle('비겼습니다!')
                        .setDescription(`당신 : ${rspEmoji[interection.customId]} vs ${rspEmoji[botValue]} : 봇`);
                    await interection.reply({ embeds: [drawEmbed] });
                }
            });
        } catch(error) {
            console.error(error);
        }
    }
};