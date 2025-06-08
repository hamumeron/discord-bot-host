const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Discord Bot クライアント
const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Bot 起動イベント
bot.once('ready', () => {
  console.log(`${bot.user.tag} が起動しました！`);
});

// メッセージコマンド例
bot.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});

// Bot ログイン
bot.login(process.env.DISCORD_TOKEN);

// Web API エンドポイント（動作確認用）
app.get('/', (req, res) => {
  res.send('Botサーバーは稼働中です。');
});

app.listen(PORT, () => {
  console.log(`Webサーバー起動済み: http://localhost:${PORT}`);
});
