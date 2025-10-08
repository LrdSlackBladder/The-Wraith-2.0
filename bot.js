// === ENV SETUP ===
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
const OWNER_ID = '1176147684634144870';
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452';
const CLEANUP_CHANNEL_ID = '1384803714753232957';
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941';
const PRIVATE_CHANNEL_ID = '1387800979155452046';
const SIGNAL_VOICE_CHANNEL_ID = '1339149195688280090';
const STREAM_ANNOUNCE_CHANNEL_ID = '1400070125150933032';

const LORE_COOLDOWN_MINUTES = 60;
const loreCooldown = new Map();
const joinedDuringStream = new Map();
// removed: let streamActive = false; // (no longer used)
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
  const userId = message.author.id;

  if (content === '!ping') return message.channel.send('Pong!');
  if (content === '!help') {
    return message.channel.send(
      `**Commands:**\n- !ping\n- !help\n- !wraithpause\n- !wraithresume\n- !forcecleanup\n- !wraithsay`
    );
  }

  if (content === '!wraithpause' && userId === OWNER_ID) {
    wraithPaused = true;
    return message.channel.send('Wraith has been paused.');
  }

  if (content === '!wraithresume' && userId === OWNER_ID) {
    wraithPaused = false;
    return message.channel.send('Wraith has resumed.');
  }

  // === CUSTOM EMBED ANNOUNCEMENT (manual-only, rate-limited) ===
  const ANNOUNCE_COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
  if (typeof global.lastManualAnnounceAt === 'undefined') global.lastManualAnnounceAt = 0;

  if (message.content.startsWith('!wraithsay') && userId === OWNER_ID) {
    const messageText = message.content.replace('!wraithsay', '').trim();

    if (!messageText) {
      return message.reply('Usage: `!wraithsay your message here`');
    }

    if (Date.now() - global.lastManualAnnounceAt < ANNOUNCE_COOLDOWN_MS) {
      const wait = Math.ceil((ANNOUNCE_COOLDOWN_MS - (Date.now() - global.lastManualAnnounceAt)) / 60000);
      return message.reply(`Cooldown active. Try again in ~${wait} min.`);
    }

    const embed = new EmbedBuilder()
      .setTitle('🕯️ The Wraith Speaks')
      .setDescription(messageText)
      .setColor(0x5a1e6d)
      .setFooter({ text: 'The Wraith has spoken...' })
      .setTimestamp();

    try {
      const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID);
      const logChannel = await client.channels.fetch(ADMIN_LOG_CHANNEL_ID);
      if (announceChannel?.isTextBased()) {
        await message.delete().catch(() => {});
        await announceChannel.send({ embeds: [embed] });
        global.lastManualAnnounceAt = Date.now();
        if (logChannel?.isTextBased()) {
          await logChannel.send(`[WRAITH] Manual announce by <@${OWNER_ID}> → <#${STREAM_ANNOUNCE_CHANNEL_ID}>`);
        }
      } else {
        return message.reply('Announcement channel is not available.');
      }
    } catch (err) {
      console.error('[WRAITH EMBED ERROR]', err);
      return message.reply('An error occurred while sending the Wraith\'s message.');
    }

    return;
  }

  if (wraithPaused) return;

  if (content === '!forcecleanup' && userId === OWNER_ID) {
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

// === STREAM MONITORING (no auto-announcements) ===
client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    const member = newState.member;
    const voiceChannel = newState.channel;

    // Grant role when joining the Signal voice channel
    if (voiceChannel && voiceChannel.id === SIGNAL_VOICE_CHANNEL_ID) {
      const guildMember = await member.guild.members.fetch(member.id);
      if (!guildMember.roles.cache.has(SIGNAL_WATCHER_ROLE_ID)) {
        await guildMember.roles.add(SIGNAL_WATCHER_ROLE_ID);
        joinedDuringStream.set(member.id, Date.now()); // kept for 7-day cleanup
      }
    }

    // No auto "I'm live" announcements
    // No end-of-stream thank-you announcements

  } catch (err) {
    console.error('[voiceStateUpdate error]', err);
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
