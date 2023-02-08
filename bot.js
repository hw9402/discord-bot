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

const { prefix, token } = require('./config.json');
const fs = require('node:fs');

// client.commands = new Discord.Collection();
// const commandsFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// for(const file of commandsFile) {
// 	const command = require(`./commands/${file}`);
// 	client.commands.set(command.name, command);
// }

client.once('ready', () => {
    console.log(`${client.user.tag} 봇에 로그인 했습니다`);
});

client.on('messageCreate', (msg) => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return; // 접두사를 사용하지 않거나 메시지를 보낸 주체가 봇이라면 함수 종료
	const commandBody = msg.content.slice(prefix.length); 		  // 접두사를 제외한 문자열 가져오기
	const args = commandBody.split(' '); 				  		  // 공백을 기준으로 문자열 가져와서 배열에 저장
	const command = args.shift().toLowerCase(); 		  		  // 배열의 0번째 문자열을 가져와서 커맨드로 저장
	/*-----------------------------------------------------------*/
	try {
		switch(command) {
			case 'ping':
				msg.reply('pong!');
				break;
			case 'rsp':
				const rsp = ['가위', '바위', '보'];
				let userValue = args;
				let botValue = rsp[Math.floor(Math.random() * 3)];
				if(
					(userValue == rsp[0] && botValue == rsp[2])
				 || (userValue == rsp[1] && botValue == rsp[0])
				 || (userValue == rsp[2] && botValue == rsp[1])) {
					msg.reply(`당신 : ${userValue} vs ${botValue} : 봇 | 당신의 승리입니다!`);
				} else if(
					(botValue == rsp[0] && userValue == rsp[2])
				 || (botValue == rsp[1] && userValue == rsp[0])
				 || (botValue == rsp[2] && userValue == rsp[1])
				) {
					msg.reply(`당신 : ${userValue} vs ${botValue} : 봇 | 당신의 패배입니다!`);
				} else {
					msg.reply(`당신 : ${userValue} vs ${botValue} : 봇 | 비겼습니다!`);
				}
				botValue = '';
				break;
		}
	} catch(error) {
		console.log(error);
	}
});

client.login(token);