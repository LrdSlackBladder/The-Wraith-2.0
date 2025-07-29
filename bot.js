require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const responses = require('./data/responses');
const triggers = require('./data/triggers');
const http = require('http');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

// Channel & role IDs (replace these with actual channel IDs)
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452'; // Replace with actual role ID
const CLEANUP_CHANNEL_ID = '1384803714753232957'; // Replace with actual channel ID for cleanup
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941'; // Replace with your log channel ID
const PRIVATE_CHANNEL_ID = '1387800979155452046'; // Replace with private channel ID

const LORE_COOLDOWN_MINUTES = 60;
const loreCooldown = new Map();

// Flag to pause bot responses
let wraithPaused = false;

// Keep-alive ping
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('The Wraith is watching...\n');
}).listen(process.env.PORT || 3000);

client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

client.on('messageCreate', async (message) => {
  // Prevent bot from responding to itself
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Log incoming message to see what the bot is receiving
  console.log(`[DEBUG] Received message: ${content} from ${message.author.username} (${message.author.id})`);

  // Command to pause the bot (only for specific user or admin)
  if (content === '!wraithpause') {
    console.log(`[DEBUG] Checking if user ID matches: ${message.author.id}`);
    if (message.author.id === '1176147684634144870') {  // Replace with your actual User ID
      console.log("Pause command received.");
      wraithPaused = true;
      return message.channel.send("Wraith has been paused.");
    } else {
      console.log("Pause command failed: User ID does not match.");
    }
  }

  // Command to resume the bot (only for specific user or admin)
  if (content === '!wraithresume') {
    console.log(`[DEBUG] Checking if user ID matches: ${message.author.id}`);
    if (message.author.id === '1176147684634144870') {  // Replace with your actual User ID
      console.log("Resume command received.");
      wraithPaused = false;
      return message.channel.send("Wraith has resumed.");
    } else {
      console.log("Resume command failed: User ID does not match.");
    }
  }

  // If the bot is paused, do not process any further commands
  if (wraithPaused) {
    console.log("[DEBUG] Wraith is paused. Commands are being ignored.");
    return;
  }

  // Handle other commands (e.g., !ping, !help, etc.)
  if (content === '!ping') {
    return message.channel.send('Pong!');
  }

  if (content === '!help') {
    const helpMessage = `
      **Available Commands:**
      - !ping: Responds with "Pong!"
      - !help: Lists all available commands
      - !wraithpause: Pauses the bot's responses (admin only)
      - !wraithresume: Resumes the bot's responses (admin only)
      - !forcecleanup: Forces cleanup of old messages (admin only)
    `;
    return message.channel.send(helpMessage);
  }

  // Command to force cleanup of messages older than 24h
  if (content === '!forcecleanup' && message.author.id === '1176147684634144870') {
    console.log("Force cleanup command received.");
    // Trigger cleanup logic
    const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
    if (cleanupChannel && cleanupChannel.isTextBased()) {
      try {
        const messages = await cleanupChannel.messages.fetch({ limit: 100 });
        const now = Date.now();
        const oldMessages = messages.filter(msg => now - msg.createdTimestamp > 24 * 60 * 60 * 1000);

        if (oldMessages.size > 0) {
          await cleanupChannel.bulkDelete(oldMessages, true);
          await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');
        }
      } catch (err) {
        console.error('[FORCE CLEANUP ERROR]', err);
        message.channel.send('An error occurred while performing cleanup.');
      }
    } else {
      message.channel.send('Cleanup channel not found!');
    }
    return;
  }

  // Your existing logic for other responses (reactionary, private themes, etc.)
  const isPrivate = message.channel.id === PRIVATE_CHANNEL_ID;
  const isMention = message.mentions.has(client.user);

  // Respond to @ping in public channels
  if (isMention && !isPrivate) {
    const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
    return message.channel.send(`*${reply}*`);
  }

  // Private channel logic (message processing)
  if (isPrivate) {
    const contentWords = content.split(/\s+/);

    // 🎞️ GIF detection (robust for Tenor, Discord, Giphy)
    const hasGif =
      [...message.attachments.values()].some(file =>
        file.contentType?.toLowerCase().includes('gif') ||
        file.url.toLowerCase().endsWith('.gif')
      ) ||
      /(tenor\.com\/view\/.+-gif-\d+)|(giphy\.com\/gifs\/)|(media\.discordapp\.net\/attachments\/.+\.gif)/i.test(content);

    if (hasGif && Array.isArray(responses.gifDetected) && responses.gifDetected.length > 0) {
      const gifReply = responses.gifDetected[Math.floor(Math.random() * responses.gifDetected.length)];
      await message.channel.sendTyping();
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
      return message.channel.send(`*${gifReply}*`);
    }

    // 🧠 Reactionary response (best match logic)
    let bestReactionary = null;
    let reactionaryScore = 0;

    if (Array.isArray(responses.reactionary)) {
      for (const r of responses.reactionary) {
        let score = 0;
        for (const trigger of r.triggers) {
          const regex = new RegExp(`\\b${trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (regex.test(content)) score++;
        }
        if (score > reactionaryScore) {
          reactionaryScore = score;
          bestReactionary = r;
        }
      }

      if (bestReactionary && reactionaryScore > 0) {
        await message.channel.sendTyping();
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1500));
        return message.channel.send(`*${bestReactionary.text}*`);
      }
    }

    // 🔒 Private theme category match (e.g., sad, bored)
    let bestTheme = null;
    let bestThemeScore = 0;

    for (const [category, words] of Object.entries(triggers.privateTriggers)) {
      let score = words.filter(trigger => content.includes(trigger)).length;
      if (score > bestThemeScore) {
        bestThemeScore = score;
        bestTheme = category;
      }
    }

    if (bestTheme && responses.privateThemes[bestTheme]) {
      const reply = responses.privateThemes[bestTheme][Math.floor(Math.random() * responses.privateThemes[bestTheme].length)];
      await message.channel.sendTyping();
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return message.channel.send(`*${reply}*`);
    }

    // 🛑 Fallback: neutral reply if no theme or reaction matched
    if (Array.isArray(responses.private)) {
      const reply = responses.private[Math.floor(Math.random() * responses.private.length)];
      await message.channel.sendTyping();
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      return message.channel.send(`*${reply}*`);
    }

    return;
  }

  // 🌐 Public triggers logic (for other responses)
  let matchedCategory = null;

  for (const [category, triggerWords] of Object.entries(triggers)) {
    if (Array.isArray(triggerWords) && triggerWords.some(trigger => content.includes(trigger))) {
      matchedCategory = category;
      break;
    }
  }

  if (!matchedCategory) return;

  // 🧠 Lore-only (Signal Watchers only)
  const isSignalWatcher = message.member?.roles.cache.has(SIGNAL_WATCHER_ROLE_ID);

  if (matchedCategory === 'lore' && isSignalWatcher && Math.random() <= 0.2) {
    const lastTime = loreCooldown.get(message.author.id) || 0;
    const now = Date.now();
    const cooldownMs = LORE_COOLDOWN_MINUTES * 60 * 1000;

    if (now - lastTime > cooldownMs) {
      const exclusiveReply = responses.loreExclusive[Math.floor(Math.random() * responses.loreExclusive.length)];
      loreCooldown.set(message.author.id, now);
      return message.channel.send(`*${exclusiveReply}*`);
    }
  }

  // 📡 General public reply (40% chance)
  if (Math.random() <= 0.4) {
    const replyOptions = responses[matchedCategory];
    if (Array.isArray(replyOptions)) {
      const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      return message.channel.send(`*${reply}*`);
    }
  }
});

// 🧹 Daily cleanup of messages older than 24h
setInterval(async () => {
  const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
  const logChannel = await client.channels.fetch(ADMIN_LOG_CHANNEL_ID);

  if (cleanupChannel && cleanupChannel.isTextBased()) {
    try {
      const messages = await cleanupChannel.messages.fetch({ limit: 100 });
      const now = Date.now();
      const oldMessages = messages.filter(msg => now - msg.createdTimestamp > 24 * 60 * 60 * 1000);

      if (oldMessages.size > 0) {
        await cleanupChannel.bulkDelete(oldMessages, true);
        await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');

        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send(`[WRAITH SYSTEM]: Cleanup completed — ${oldMessages.size} items removed.`);
        }
      }
    } catch (err) {
      console.error('[WRAITH CLEANUP ERROR]', err);
    }
  }
}, 24 * 60 * 60 * 1000); // Every 24h

// 🛡️ Crash protection
process.on('uncaughtException', err => console.error('Uncaught exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

client.login(process.env.DISCORD_TOKEN);
