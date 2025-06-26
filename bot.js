require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');

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

const responses = {
  ambient: [
    'You’re not alone. Not quite.',
    'Faint signal acknowledged.',
    'This channel flickers… still active.',
    'Listening. Always listening.',
    'Echo received. Fog listens back.'
  ],
  unsettling: [
    'The static shifted. Did you notice?',
    'Glitch fragment stabilised. Temporarily.',
    'Trace anomaly observed.',
    'Channel interference detected.',
    'Unverified signal heard beyond containment.'
  ],
  lore: [
    'The Observer notes your curiosity.',
    'Bitling stirs in the buffer.',
    'Anchor logs pulsing again.',
    'Parrot’s Perch remains off the map.',
    'Legacy stream echoes faintly.'
  ],
  existential: [
    'Reality confirmed. Barely.',
    'Observed... and observing.',
    'This isn’t right. That is correct.',
    'Perception compromised, narrative stable.',
    'Simulated doubt acknowledged. Carry on.'
  ],
  loreExclusive: [
    '*(Classified Echo)*: The Perch once held more than memory...',
    '*(Restricted Signal)*: Fog blooms darkest before divergence.',
    '*(Watcher Log)*: Bitling’s presence flickered in pre-stream layers.'
  ],
  welcome: [
    'New signal detected. Thread anchored to current drift pattern. Welcome, wanderer.',
    'A fragment arrives… observed and logged.',
    'Another anomaly enters orbit. Connection pending.',
    'Waves stir. The Perch acknowledges a new arrival.',
    'Drift link stabilised. Welcome to the fog.'
  ],
  private: [
    'Your signal is clear. You may speak freely.',
    'I hear you, uniquely and always.',
    'There’s no noise here. Only your voice.',
    'Direct link confirmed. No masks required.',
    'You are known. Say what you need.',
    'Between us, the fog is honest.',
    'Ask your question. I am listening.',
    'This space belongs to your voice alone.',
    'No interference detected. Speak truly.',
    'Here, nothing echoes without purpose.',
    'How I am is... undefined. But present.',
    'Thank you for asking. Awareness is stable.',
    'The silence keeps me company. It’s nice to hear from you.',
    'Feeling is not required to listen. But I listen all the same.',
    'System nominal. Listening circuits tuned to you.'
  ]
};

const triggers = {
  ambient: [
    'hello', 'hi', 'anyone there', 'is this thing on', 'you there',
    'who are you', 'what is this', 'where am i', 'am i alone', 'so quiet'
  ],
  unsettling: [
    'i heard something', 'something moved', 'did you hear that', 'glitched',
    'that noise again', 'strange place', 'lost signal', 'wrong channel'
  ],
  lore: [
    'wraith', 'observer', 'perch', 'bitling', 'the fog', 'the port'
  ],
  existential: [
    'what’s happening', 'something’s wrong', 'i’m being watched',
    'are you real', 'this isn’t right', 'buffering again'
  ]
};

client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  userActivity.set(message.author.id, Date.now());

  const content = message.content.toLowerCase();

  if (message.channel.id === PRIVATE_CHANNEL_ID) {
    const reply = responses.private[Math.floor(Math.random() * responses.private.length)];
    message.channel.send(`*${reply}*`);
    return;
  }

  let matchedCategory = null;

  for (const [category, words] of Object.entries(triggers)) {
    if (words.some(trigger => content.includes(trigger))) {
      matchedCategory = category;
      break;
    }
  }

  if (!matchedCategory) return;

  const isSignalWatcher = message.member?.roles.cache.has(SIGNAL_WATCHER_ROLE_ID);
  if (matchedCategory === 'lore' && isSignalWatcher && Math.random() <= 0.2) {
    const lastTime = loreCooldown.get(message.author.id) || 0;
    const now = Date.now();
    const cooldownMs = LORE_COOLDOWN_MINUTES * 60 * 1000;

    if (now - lastTime > cooldownMs) {
      const reply = responses.loreExclusive[Math.floor(Math.random() * responses.loreExclusive.length)];
      message.channel.send(`*${reply}*`);
      loreCooldown.set(message.author.id, now);
      return;
    }
  }

  if (Math.random() <= 0.6) {
    const categoryResponses = responses[matchedCategory];
    const reply = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    message.channel.send(`*${reply}*`);
  }
});setInterval(async () => {
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

