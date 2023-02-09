const Discord = require('discord.js');
const { Client, GatewayIntentBits, EmbedBuilder, Events } = Discord;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const { prefix, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

// 커맨드 등록
/* ---------------------------------------------------------------------------------------------------------- */
client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandsFile) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
/* ---------------------------------------------------------------------------------------------------------- */

client.once('ready', () => {
    console.log(`${client.user.tag} 봇에 로그인 했습니다`);
});

client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return; // 입력된 채팅이 상호작용인지 확인
	const command = interaction.client.commands.get(interaction.commandName);
	if(!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	console.log(interaction);
});

client.login(token);