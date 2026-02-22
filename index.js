// Webserver für Render
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot läuft!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Webserver läuft");
});

// Fehlerhandling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// Env Variables
require('dotenv').config();

// Discord.js Setup
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Ready Event
client.once('ready', () => {
  console.log(`Bot ist online als ${client.user.tag}!`);
});

// Commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Ping Command
  if (message.content === '!ping') {
    message.channel.send('Pong! 🏓');
  }

  // Nuke Command
  if (message.content === ".nuke") {
    // Nachricht sofort löschen (unsichtbar)
    await message.delete().catch(() => {});

    // Nur Server Owner darf nuken
    if (message.guild.ownerId !== message.author.id) return;

    const channel = message.channel;

    const newChannel = await channel.clone();
    await channel.delete();

    // Nachricht im neuen Channel
    newChannel.send("💥 Channel wurde vom Server Owner genuked.");
  }
});

// Login
client.login(process.env.TOKEN);
