require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

const responses = require('./data/responses');
const triggers = require('./data/triggers');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

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

client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  userActivity.set(message.author.id, Date.now());
  const content = message.content.toLowerCase();

  // 🛡️ PRIVATE CHANNEL LOGIC (for your son)
  if (message.channel.id === PRIVATE_CHANNEL_ID) {
    const theme = Object.entries(triggers.privateTriggers).find(([key, triggerWords]) =>
      triggerWords.some(trigger => content.includes(trigger))
    );

    let reply;
    if (theme) {
      const [category] = theme;
      const themedReplies = responses.privateThemes[category];
      reply = themedReplies[Math.floor(Math.random() * themedReplies.length)];
    } else {
      const fallback = responses.private;
      reply = fallback[Math.floor(Math.random() * fallback.length)];
    }

    message.channel.send(`*${reply}*`);
    return;
  }

  // 🌐 PUBLIC CHANNEL LOGIC
  let matchedCategory = null;

  for (const [category, triggerWords] of Object.entries(triggers)) {
    if (triggerWords.some(trigger => content.includes(trigger))) {
      matchedCategory = category;
      break;
    }
  }

  if (!matchedCategory) return;

  // 🎯 Lore Exclusive (Signal Watcher role & cooldown)
  const isSignalWatcher = message.member?.roles.cache.has(SIGNAL_WATCHER_ROLE_ID);
  if (matchedCategory === 'lore' && isSignalWatcher && Math.random() <= 0.2) {
    const lastTime = loreCooldown.get(message.author.id) || 0;
    const now = Date.now();
    const cooldownMs = LORE_COOLDOWN_MINUTES * 60 * 1000;

    if (now - lastTime > cooldownMs) {
      const exclusiveReply = responses.loreExclusive[Math.floor(Math.random() * responses.loreExclusive.length)];
      message.channel.send(`*${exclusiveReply}*`);
      loreCooldown.set(message.author.id, now);
      return;
    }
  }

  // 📡 Normal matched response
  if (Math.random() <= 0.6) {
    const replyOptions = responses[matchedCategory];
    const reply = replyOptions[Math.floor(Math.random() * replyOptions.length)];
    message.channel.send(`*${reply}*`);
  }
});

// 🧹 DAILY CLEANUP: Clears old messages from CLEANUP_CHANNEL
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
          await logChannel.send(`[WRAITH SYSTEM]: Cleanup completed in Trains channel — ${oldMessages.size} items removed.`);
        }
      }
    } catch (err) {
      console.error('[WRAITH CLEANUP ERROR]', err);
    }
  }
}, 24 * 60 * 60 * 1000); // Every 24 hours

client.login(process.env.DISCORD_TOKEN);

