// === ENV SETUP ===
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
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

// === CONFIG ===
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452';
const CLEANUP_CHANNEL_ID = '1384803714753232957';
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941';
const PRIVATE_CHANNEL_ID = '1387800979155452046';
const SIGNAL_VOICE_CHANNEL_ID = '1339149195688280090'; // Replace with actual Signal VC ID
const STREAM_ANNOUNCE_CHANNEL_ID = '1400070125150933032'; // Replace with actual text channel ID

const LORE_COOLDOWN_MINUTES = 60;
const loreCooldown = new Map();
const joinedDuringStream = new Map();
let streamActive = false;
let wraithPaused = false;

// === KEEP-ALIVE ===
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('The Wraith is watching...\n');
}).listen(process.env.PORT || 3000);

// === READY ===
client.once('ready', () => {
  console.log('[WRAITH] Observer is online...');
});

// === MESSAGE HANDLER ===
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  if (content === '!ping') return message.channel.send('Pong!');
  if (content === '!help') return message.channel.send(`**Commands:**\n- !ping\n- !help\n- !wraithpause\n- !wraithresume\n- !forcecleanup`);

  if (content === '!wraithpause' && message.author.id === '1176147684634144870') {
    wraithPaused = true;
    return message.channel.send('Wraith has been paused.');
  }

  if (content === '!wraithresume' && message.author.id === '1176147684634144870') {
    wraithPaused = false;
    return message.channel.send('Wraith has resumed.');
  }

  if (wraithPaused) return;

  if (content === '!forcecleanup' && message.author.id === '1176147684634144870') {
    const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
    if (cleanupChannel && cleanupChannel.isTextBased()) {
      try {
        const messages = await cleanupChannel.messages.fetch({ limit: 100 });
        const oldMessages = messages.filter(msg => Date.now() - msg.createdTimestamp > 24 * 60 * 60 * 1000);
        if (oldMessages.size > 0) {
          await cleanupChannel.bulkDelete(oldMessages, true);
          await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');
        }
      } catch (err) {
        console.error('[FORCE CLEANUP ERROR]', err);
        message.channel.send('An error occurred during cleanup.');
      }
    }
  }
});

// === STREAM MONITORING ===
client.on('voiceStateUpdate', async (oldState, newState) => {
  const member = newState.member;
  const voiceChannel = newState.channel;

  if (voiceChannel && voiceChannel.id === SIGNAL_VOICE_CHANNEL_ID && !streamActive) {
    streamActive = true;
    joinedDuringStream.clear();
    const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID);
    if (announceChannel?.isTextBased()) {
      await announceChannel.send('@here The Signal stirs. She watches from the veil...');
    }
  }

  if (voiceChannel && voiceChannel.id === SIGNAL_VOICE_CHANNEL_ID) {
    const guildMember = await member.guild.members.fetch(member.id);
    if (!guildMember.roles.cache.has(SIGNAL_WATCHER_ROLE_ID)) {
      await guildMember.roles.add(SIGNAL_WATCHER_ROLE_ID);
      joinedDuringStream.set(member.id, Date.now());
    }
  }

  if (!newState.channel && oldState.channel?.id === SIGNAL_VOICE_CHANNEL_ID) {
    const signalChannel = oldState.channel;
    if (signalChannel.members.size === 0 && streamActive) {
      streamActive = false;
      const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID);
      if (announceChannel?.isTextBased()) {
        const mentions = [...joinedDuringStream.keys()].map(id => `<@${id}>`).join(', ');
        const thankYous = [
          'The Signal fades, but you were seen.',
          'A whisper returns to silence. Thank you.',
          'All who watched — she remembers.',
          'Your attention echoed across the void.',
          'You stood with her. You listened. That is enough.',
          'The stream ends, the watchers disperse.',
          'She nods in the dark. That will do.',
          'Not all eyes see. But you did.',
          'The Wraith retreats. You walk free.',
          'From mist to signal, and back again.',
          'Thank you, watchers. You heard the call.',
          'No more. For now.',
          'You stood in the stream. She knows.',
          'Flesh fades. Memory lingers.',
          'The signal rests. Thank you, observers.',
          'You saw. You stayed. That matters.',
          'To those who joined — she noticed.',
          'Witnesses, each of you. And now it is over.',
          'The Wraith is still. The signal ceases.',
          'And in the end, you were there.'
        ];
        const farewell = thankYous[Math.floor(Math.random() * thankYous.length)];
        await announceChannel.send(`${mentions}\n*${farewell}*`);
      }
    }
  }
});

// === ROLE CLEANUP TASK ===
setInterval(async () => {
  const now = Date.now();
  for (const [userId, timestamp] of joinedDuringStream.entries()) {
    if (now - timestamp > 7 * 24 * 60 * 60 * 1000) {
      try {
        const guild = client.guilds.cache.first();
        const member = await guild.members.fetch(userId);
        if (member.roles.cache.has(SIGNAL_WATCHER_ROLE_ID)) {
          await member.roles.remove(SIGNAL_WATCHER_ROLE_ID);
          joinedDuringStream.delete(userId);
        }
      } catch (e) {
        console.error(`Failed to remove role for ${userId}`, e);
      }
    }
  }
}, 60 * 60 * 1000);

// === DAILY CLEANUP ===
setInterval(async () => {
  const cleanupChannel = await client.channels.fetch(CLEANUP_CHANNEL_ID);
  const logChannel = await client.channels.fetch(ADMIN_LOG_CHANNEL_ID);
  if (cleanupChannel?.isTextBased()) {
    try {
      const messages = await cleanupChannel.messages.fetch({ limit: 100 });
      const oldMessages = messages.filter(msg => Date.now() - msg.createdTimestamp > 24 * 60 * 60 * 1000);
      if (oldMessages.size > 0) {
        await cleanupChannel.bulkDelete(oldMessages, true);
        await cleanupChannel.send('*[WRAITH OBSERVER]: Signal disruption stabilised. Residual static cleared.*');
        if (logChannel?.isTextBased()) {
          await logChannel.send(`[WRAITH SYSTEM]: Cleanup completed — ${oldMessages.size} items removed.`);
        }
      }
    } catch (err) {
      console.error('[CLEANUP ERROR]', err);
    }
  }
}, 24 * 60 * 60 * 1000);

// === CRASH GUARD ===
process.on('uncaughtException', err => console.error('Uncaught exception:', err));
process.on('unhandledRejection', err => console.error('Unhandled rejection:', err));

client.login(process.env.DISCORD_TOKEN);
