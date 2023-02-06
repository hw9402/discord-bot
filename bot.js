const Discord = require('discord.js');
const { Client, GatewayIntentBits } = Discord;
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const {prefix, token} = require('./config.json');
const fs = require('node:fs');

client.commands = new Discord.Collection();
const commandsFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandsFile) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`${client.user.tag} 봇에 로그인 했습니다`);
});

client.on('messageCreate', (msg) => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;
	const args = msg.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift();
	const command = client.commands.get(commandName);
	try {
		command.execute(msg, args);
	} catch(error) {
		console.error(error);
	}
});

client.login(token);