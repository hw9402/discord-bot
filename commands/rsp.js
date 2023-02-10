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
                        .setLabel('✊🏻')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('scissors')
                        .setLabel('✌🏻')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('paper')
                        .setLabel('🖐🏻')
                        .setStyle(ButtonStyle.Secondary),
            );


            const startEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('봇과 하는 가위바위보!')
                    .setDescription('이모지를 눌러보세요!');
            const finishEmbed = new EmbedBuilder()
                    .setColor(0x7C7C7C)
                    .setTitle('게임이 끝났습니다!')
                    .setDescription('\'/rsp\' 를 입력해서 봇과 가위바위보를 한 번 해보세요!');

    
            // - ephemeral: true => 메시지를 보낸 유저에게만 보이도록 설정
            await interection.reply({ embeds: [startEmbed], components: [row]});


            const filter = (interection) => {
                return interection.customId === 'rock' || 'scissors' || 'paper';
            };

            const collector = interection.channel.createMessageComponentCollector({
                filter,
                time: 4 * 1000, //몇초동안 반응할 수 있는지
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
                    (interection.customId === 'paper' && botValue == rsp[1]) ||
                    (interection.customId === 'rock' && botValue == rsp[2]) ||
                    (interection.customId === 'scissors' && botValue == rsp[0])) {
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

            collector.on('end', async (collect) => {
                await interection.editReply({ embeds: [finishEmbed], components: []});
                // row.components[0].setDisabled(true);
                console.log('시간 초과');
            })

        } catch(error) {
            console.error(error);
        }
    }
};