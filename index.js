// Webserver for Render
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Webserver is running");
});

// Error handling
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
  console.log(`Bot is online as ${client.user.tag}!`);
});

// Commands
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Ping Command
  if (message.content === '!ping') {
    message.channel.send('Pong! 🏓');
  }

  // Safe Nuke Command
  if (message.content === ".nuke") {
    // Delete the command message (invisible)
    await message.delete().catch(() => {});

    // Only Server Owner can nuke
    if (message.guild.ownerId !== message.author.id) {
        message.channel.send("❌ Only the Server Owner can use this command!")
          .then(msg => setTimeout(() => msg.delete(), 5000)); // delete after 5 sec
        return;
    }

    // Clone the channel and delete the old one
    const channel = message.channel;
    const newChannel = await channel.clone();
    await channel.delete();

    // Embed message in the new channel
    const embed = new EmbedBuilder()
        .setTitle("💥 Channel Nuked")
        .setDescription(`This channel was nuked by the Server Owner **${message.author.tag}**.`)
        .setColor("Red")
        .setTimestamp();

    newChannel.send({ embeds: [embed] });
  }
});

// Login
client.login(process.env.TOKEN);
