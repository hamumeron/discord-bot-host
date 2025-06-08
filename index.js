// /bot/index.js
const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

const prefix = '!';
const servers = new Map();  // 仮想サーバー管理用マップ

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  if (command === 'start') {
    const serverName = args[0];
    if (!serverName) return message.reply('サーバー名を指定してください。');

    if (servers.get(serverName) === 'running') {
      return message.reply(`${serverName}はすでに起動中です。`);
    }
    servers.set(serverName, 'running');
    message.reply(`${serverName}を起動しました。`);
  } else if (command === 'stop') {
    const serverName = args[0];
    if (!serverName) return message.reply('サーバー名を指定してください。');

    if (servers.get(serverName) !== 'running') {
      return message.reply(`${serverName}は起動していません。`);
    }
    servers.set(serverName, 'stopped');
    message.reply(`${serverName}を停止しました。`);
  } else if (command === 'status') {
    const statusList = Array.from(servers.entries())
      .map(([name, status]) => `${name}: ${status}`)
      .join('\n') || 'サーバーは登録されていません。';
    message.reply(`サーバーステータス:\n${statusList}`);
  }
});

client.login(process.env.DISCORD_TOKEN);

