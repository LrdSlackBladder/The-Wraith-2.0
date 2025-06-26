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

// Utility: delay helper
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Keep-alive server to prevent idle shutdowns
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('The Wraith is watching...\n');
}).listen(process.env.PORT || 3000);

// On ready
client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

// Main message handler
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    const content = message.content.toLowerCase();
    userActivity.set(message.author.id, Date.now());
    console.log(`[DEBUG] Message in ${message.channel.id} from ${message.author.username}: ${message.content}`);

    // ➤ Public ping handling
    if (message.mentions.has(client.user) && message.channel.id !== PRIVATE_CHANNEL_ID) {
      await wait(1500);
      const reply = responses.ambient[Math.floor(Math.random() * responses.ambient.length)];
      return message.channel.send(`*${reply}*`);
    }

    // ➤ Private channel logic
    if (message.channel.id === PRIVATE_CHANNEL_ID) {
      const theme = Object.entries(triggers.privateTriggers).find(
        ([, triggerWords]) => Array.isArray(triggerWords) && triggerWords.some(t => content.includes(t))
      );
      let reply;
      if (theme) {
        const [category] = theme;
        const arr = responses.privateThemes?.[category];
        if (Array.isArray(arr) && arr.length) {
          reply = arr[Math.floor(Math.random() * arr.length)];
        }
      }
      if (!reply && Array.isArray(responses.private)) {
        reply = responses.private[Math.floor(Math.random() * responses.private.length)];
      }
      if (reply) {
        await wait(2500);
        return message.channel.send(`*${reply}*`);
      }
      return;
    }

    // ➤ Public trigger matching
    let matchedCategory = null;
    for (const [category, words] of Object.entries(triggers)) {
      if (Array.isArray(words) && words.some(w => content.includes(w))) {
        matchedCategory = category;
        break;
      }
    }
    if (!matchedCategory) return;

    // ➤ Lore cooldown for Signal Watchers
    if (
      matchedCategory === 'lore' &&
      message.member?.roles.cache.has(SIGNAL_WATCHER_ROLE_ID) &&
      Math.random() <= 0.2
    ) {
      const lastTime = loreCooldown.get(message.author.id) || 0;
      const now = Date.now();
      if (now - lastTime > LORE_COOLDOWN_MINUTES * 60 * 1000) {
        const excl = responses.loreExclusive[Math.floor(Math.random() * responses.loreExclusive.length)];
        await wait(2500);
        message.channel.send(`*${excl}*`);
        loreCooldown.set(message.author.id, now);
        return;
      }
    }

    // ➤ General public response
    if (Math.random() <= 0.6) {
      const arr = responses[matchedCategory];
      if (Array.isArray(arr)) {
        const reply = arr[Math.floor(Math.random() * arr.length)];
        await wait(2000 + Math.random() * 1500);
        message.channel.send(`*${reply}*`);
      }
    }
  } catch (err) {
    console.error('[ERROR] messageCreate handler failed:', err);
  }
});

// Cleanup task
setInterval(async () => {
  try {
    const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
    const logChannel = await client.channels.fetch(ADMIN_LOG_CHANNEL_ID);
    if (cleanupChannel?.isTextBased()) {
      const messages = await cleanupChannel.messages.fetch({ limit: 100 });
      const now = Date.now();
      const oldMessages = messages.filter(m => now - m.createdTimestamp > 24 * 60 * 60 * 1000);
      if (oldMessages.size) {
        await cleanupChannel.bulkDelete(oldMessages, true);
        await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');
        if (logChannel?.isTextBased()) {
          await logChannel.send(`[WRAITH SYSTEM]: Cleanup completed — ${oldMessages.size} items removed.`);
        }
      }
    }
  } catch (err) {
    console.error('[ERROR] Cleanup task failed:', err);
  }
}, 24 * 60 * 60 * 1000);

// Global crash handlers
process.on('uncaughtException', err => console.error('[CRASH] uncaughtException:', err));
process.on('unhandledRejection', err => console.error('[CRASH] unhandledRejection:', err));

// Start bot
client.login(process.env.DISCORD_TOKEN);
