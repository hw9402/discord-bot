const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const dotenv = require('dotenv').config();

client.on('ready', () => {
    console.log(`${client.user.tag} 봇에 로그인 했습니다`);
});

client.on('messageCreate', (msg) => {
    try {
        if(msg.content === 'ping') {
            msg.reply('pong!');
        }
    } catch(error) {
        console.error(error);
    }
});

client.login(process.env.TOKEN);