require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`[WRAITH] Observer is online...`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const triggers = [
    // Ambient & conversational
    'hello', 'hi', 'anyone there', 'is this thing on', 'you there',
    'who are you', 'what is this', 'where am i', 'am i alone', 'so quiet',

    // Unsettling observations
    'i heard something', 'something moved', 'did you hear that', 'glitched',
    'that noise again', 'strange place', 'lost signal', 'wrong channel',

    // Lore-based
    'wraith', 'observer', 'perch', 'bitling', 'the fog', 'the port',

    // Existential or meta
    'what’s happening', 'something’s wrong', 'i’m being watched',
    'are you real', 'this isn’t right', 'buffering again'.env
  const responses = [
    'Echo registered. Divergence remains within expected boundaries.',
    'Fog density elevated. Narrative coherence... variable.'
    // Add the rest here
  ];

  const content = message.content.toLowerCase();
  if (triggers.some(trigger => content.includes(trigger))) {
    if (Math.random() <= 0.6) {
      const reply = responses[Math.floor(Math.random() * responses.length)];
message.channel.send(`*${reply}*`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);