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
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

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

  // Sicherer Nuke Command
  if (message.content === ".nuke") {
    // Nachricht sofort löschen (unsichtbar)
    await message.delete().catch(() => {});

    // Prüfen: nur Server Owner darf
    if (message.guild.ownerId !== message.author.id) {
        message.channel.send("❌ Nur der Server Owner darf diesen Befehl benutzen!")
          .then(msg => setTimeout(() => msg.delete(), 5000)); // nach 5 Sek. löschen
        return;
    }

    // Channel klonen und alten löschen
    const channel = message.channel;
    const newChannel = await channel.clone();
    await channel.delete();

    // Embed Nachricht im neuen Channel
    const embed = new EmbedBuilder()
        .setTitle("💥 Channel genuked")
        .setDescription(`Dieser Channel wurde vom Server Owner **${message.author.tag}** genuked.`)
        .setColor("Red")
        .setTimestamp();

    newChannel.send({ embeds: [embed] });
  }
});

// Login
client.login(process.env.TOKEN);
