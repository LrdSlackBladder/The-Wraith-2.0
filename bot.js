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
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  const user = newState.member;
  if (!user || !newState.channel) return;

  const isStreaming = newState.streaming;
  const alreadyHasRole = user.roles.cache.has(SIGNAL_WATCHER_ROLE_ID);
  const isCaptain = user.roles.cache.has(CAPTAIN_ROLE_ID);

  if (isStreaming && !alreadyHasRole && !isCaptain) {
    try {
      await user.roles.add(SIGNAL_WATCHER_ROLE_ID);
      const generalChannel = await client.channels.fetch(WELCOME_CHANNEL_ID);
      if (generalChannel && generalChannel.isTextBased()) {
        generalChannel.send(`*[WRAITH OBSERVER]: ${user.user.username} has entered the stream layer. Signal Watcher role assigned.*`);
      }
    } catch (err) {
      console.error('Error assigning role:', err);
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    await member.roles.add(WRAITH_CREW_ROLE_ID);
    const generalChannel = await client.channels.fetch(WELCOME_CHANNEL_ID);
    if (generalChannel && generalChannel.isTextBased()) {
      const welcomeMsg = responses.welcome[Math.floor(Math.random() * responses.welcome.length)];
      generalChannel.send(`*[WRAITH OBSERVER]: ${welcomeMsg}*`);
    }
  } catch (err) {
    console.error('Failed to send onboarding message or assign Wraith Crew role:', err);
  }
});

setInterval(async () => {
  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;

  const guild = client.guilds.cache.first();
  if (!guild) return;

  const role = guild.roles.cache.get(SIGNAL_WATCHER_ROLE_ID);
  if (!role) return;

  const members = role.members;
  for (const [id, member] of members) {
    if (member.roles.cache.has(CAPTAIN_ROLE_ID)) continue;

    const lastActive = userActivity.get(id) || 0;
    if (now - lastActive >= fourteenDays) {
      try {
        await member.roles.remove(SIGNAL_WATCHER_ROLE_ID);
        await member.roles.add(WRAITH_CREW_ROLE_ID);
        console.log(`[WRAITH] ${member.user.username} reverted to Wraith Crew due to inactivity.`);
      } catch (err) {
        console.error(`Failed to revert role for ${member.user.username}:`, err);
      }
    }
  }
}, 6 * 60 * 60 * 1000); // Every 6 hours

// Cleanup channel messages older than 24 hours every 24 hours
setInterval(async () => {
  try {
    const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
    if (!cleanupChannel || !cleanupChannel.isTextBased()) return;

    const now = Date.now();
    const messages = await cleanupChannel.messages.fetch({ limit: 100 });
    messages.forEach(msg => {
      if (now - msg.createdTimestamp > 24 * 60 * 60 * 1000) {
        msg.delete().catch(console.error);
      }
    });
  } catch (err) {
    console.error('Error during cleanup operation:', err);
  }
}, 24 * 60 * 60 * 1000); // Every 24 hours

// Keep-alive heartbeat to prevent Railway shutdown
setInterval(() => {
  console.log(`[WRAITH] Heartbeat – still alive at ${new Date().toISOString()}`);
}, 1000 * 60 * 5); // every 5 minutes

client.login(process.env.DISCORD_TOKEN);
