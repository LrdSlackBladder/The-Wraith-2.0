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

// Channel & role IDs
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452';
const CLEANUP_CHANNEL_ID = '1384803714753232957';
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941';
const PRIVATE_CHANNEL_ID = '1387800979155452046';

const LORE_COOLDOWN_MINUTES = 60;
const loreCooldown = new Map();

// Keep-alive ping
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('The Wraith is watching...\n');
}).listen(process.env.PORT || 3000);

client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const isPrivate = message.channel.id === PRIVATE_CHANNEL_ID;
  const isMention = message.mentions.has(client.user);

  console.log(`[DEBUG] Message in ${message.channel.id} from ${message.author.username}: ${message.content}`);

  // Respond to @ping in public channels
  if (isMention && !isPrivate) {
    const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
    return message.channel.send(`*${reply}*`);
  }

  // Private channel only
  if (isPrivate) {
    // 🎞️ GIF detection
    const hasGif = [...message.attachments.values()].some(file => file.contentType?.includes('gif')) ||
                   message.content.includes('.gif');

    if (hasGif) {
      const gifReply = responses.privateThemes.gifDetected[Math.floor(Math.random() * responses.privateThemes.gifDetected.length)];
      await message.channel.sendTyping();
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
      return message.channel.send(`*${gifReply}*`);
    }

    // 🧠 Reactionary response match (top-level, not in privateThemes)
    if (Array.isArray(responses.reactionary)) {
      for (const r of responses.reactionary) {
        if (r.triggers.some(t => content.includes(t))) {
          await message.channel.sendTyping();
          await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1500));
          return message.channel.send(`*${r.text}*`);
        }
      }
    }

    // 🔒 Private trigger category match
    let bestMatch = null;
    let bestScore = 0;

    for (const [category, words] of Object.entries(triggers.privateTriggers)) {
      let score = words.filter(trigger => content.includes(trigger)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = category;
      }
    }

    if (bestMatch && responses.privateThemes[bestMatch]) {
      const reply = responses.privateThemes[bestMatch][Math.floor(Math.random() * responses.privateThemes[bestMatch].length)];
      return message.channel.send(`*${reply}*`);
    }

    // Fallback to neutral private reply
    if (Array.isArray(responses.private)) {
      const reply = responses.private[Math.floor(Math.random() * responses.private.length)];
      return message.channel.send(`*${reply}*`);
    }

    return;
  }

  // 🌐 Public triggers
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

  // 📡 General reply
  if (Math.random() <= 0.6) {
    const replyOptions = responses[matchedCategory];
    if (Array.isArray(replyOptions)) {
      const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      return message.channel.send(`*${reply}*`);
    }
  }
});

// 🧹 Cleanup Task
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
}, 24 * 60 * 60 * 1000);

// Crash safety
process.on('uncaughtException', err => console.error('Uncaught exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

client.login(process.env.DISCORD_TOKEN);
