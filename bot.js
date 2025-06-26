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

// Constants
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452';
const WRAITH_CREW_ROLE_ID = '1384826923653267568';
const CAPTAIN_ROLE_ID = '1384826362186960999';
const WELCOME_CHANNEL_ID = '1339149195688280085';
const CLEANUP_CHANNEL_ID = '1384803714753232957';
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941';
const PRIVATE_CHANNEL_ID = '1387800979155452046';
const LORE_COOLDOWN_MINUTES = 60;

const loreCooldown = new Map();
const userActivity = new Map();

// Utility
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keep-alive server for Railway-style hosts
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('The Wraith is watching...\n');
}).listen(process.env.PORT || 3000);

// Bot is ready
client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

// Message logic
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();
  userActivity.set(message.author.id, Date.now());

  console.log(`[DEBUG] Message in ${message.channel.id} from ${message.author.username}: ${message.content}`);

  // 🔒 PRIVATE CHANNEL
  if (message.channel.id === PRIVATE_CHANNEL_ID) {
    // Respond to direct mentions
    if (message.mentions.has(client.user)) {
      const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
      await wait(1500);
      return message.channel.send(`*${reply}*`);
    }

    // Ambient fallback (e.g., “hello”, “testing”)
    const ambientTriggers = triggers.ambient;
    if (ambientTriggers.some(trigger => content.includes(trigger))) {
      const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
      await wait(1500);
      return message.channel.send(`*${reply}*`);
    }

    // Match best-fit private theme
    let bestMatch = null;
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(triggers.privateTriggers)) {
      const matchCount = keywords.filter(trigger => content.includes(trigger)).length;
      if (matchCount > maxMatches) {
        bestMatch = category;
        maxMatches = matchCount;
      }
    }

    let reply;
    if (bestMatch && Array.isArray(responses.privateThemes?.[bestMatch])) {
      const themedReplies = responses.privateThemes[bestMatch];
      reply = themedReplies[Math.floor(Math.random() * themedReplies.length)];
    }

    if (!reply && Array.isArray(responses.private)) {
      reply = responses.private[Math.floor(Math.random() * responses.private.length)];
    }

    if (reply) {
      await wait(2500);
      message.channel.send(`*${reply}*`);
    }
    return;
  }

  // 🌐 PUBLIC CHANNEL
  if (message.mentions.has(client.user)) {
    await wait(1500);
    const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
    return message.channel.send(`*${reply}*`);
  }

  let matchedCategory = null;
  for (const [category, triggerWords] of Object.entries(triggers)) {
    if (Array.isArray(triggerWords) && triggerWords.some(trigger => content.includes(trigger))) {
      matchedCategory = category;
      break;
    }
  }

  if (!matchedCategory) return;

  // 🧠 Lore Exclusive
  const isSignalWatcher = message.member?.roles.cache.has(SIGNAL_WATCHER_ROLE_ID);
  if (matchedCategory === 'lore' && isSignalWatcher && Math.random() <= 0.2) {
    const lastTime = loreCooldown.get(message.author.id) || 0;
    const now = Date.now();
    const cooldownMs = LORE_COOLDOWN_MINUTES * 60 * 1000;

    if (now - lastTime > cooldownMs) {
      const exclusiveReply = responses.loreExclusive[Math.floor(Math.random() * responses.loreExclusive.length)];
      await wait(2500);
      message.channel.send(`*${exclusiveReply}*`);
      loreCooldown.set(message.author.id, now);
      return;
    }
  }

  // 📡 General reply
  if (Math.random() <= 0.6) {
    const replyOptions = responses[matchedCategory];
    if (Array.isArray(replyOptions)) {
      const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
      await wait(2000 + Math.random() * 1500);
      message.channel.send(`*${reply}*`);
    }
  }
});

// 🧹 Cleanup task every 24h
setInterval(async () => {
  try {
    const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
    const logChannel = await client.channels.fetch(ADMIN_LOG_CHANNEL_ID);

    if (cleanupChannel && cleanupChannel.isTextBased()) {
      const messages = await cleanupChannel.messages.fetch({ limit: 100 });
      const now = Date.now();
      const oldMessages = messages.filter(msg => now - msg.createdTimestamp > 24 * 60 * 60 * 1000);

      if (oldMessages.size > 0) {
        await cleanupChannel.bulkDelete(oldMessages, true);
        await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');

        if (logChannel && logChannel.isTextBased()) {
          await logChannel.send(`[WRAITH SYSTEM]: Cleanup completed in Trains channel — ${oldMessages.size} items removed.`);
        }
      }
    }
  } catch (err) {
    console.error('[WRAITH CLEANUP ERROR]', err);
  }
}, 24 * 60 * 60 * 1000);

// 🔒 Fail-safe crash logging
process.on('uncaughtException', err => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
});

client.login(process.env.DISCORD_TOKEN);
