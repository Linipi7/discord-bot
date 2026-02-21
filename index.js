const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot läuft!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Webserver läuft");
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot ist online als ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.channel.send('Pong! 🏓');
  }
});

client.login(process.env.TOKEN);
