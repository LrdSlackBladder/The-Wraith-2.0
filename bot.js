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
const SIGNAL_WATCHER_ROLE_ID = '1384828597742866452';
const CLEANUP_CHANNEL_ID = '1384803714753232957';
const ADMIN_LOG_CHANNEL_ID = '1387795257407569941';
const PRIVATE_CHANNEL_ID = '1387800979155452046';
const SIGNAL_VOICE_CHANNEL_ID = '1339149195688280090';
const STREAM_ANNOUNCE_CHANNEL_ID = '1400070125150933032';

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
  const userId = message.author.id;

  if (content === '!ping') return message.channel.send('Pong!');
  if (content === '!help') return message.channel.send(`**Commands:**\n- !ping\n- !help\n- !wraithpause\n- !wraithresume\n- !forcecleanup\n- !wraithsay`);

  if (content === '!wraithpause' && userId === '1176147684634144870') {
    wraithPaused = true;
    return message.channel.send('Wraith has been paused.');
  }

  if (content === '!wraithresume' && userId === '1176147684634144870') {
    wraithPaused = false;
    return message.channel.send('Wraith has resumed.');
  }

  // === CUSTOM EMBED ANNOUNCEMENT ===
  if (message.content.startsWith('!wraithsay') && userId === '1176147684634144870') {
    const messageText = message.content.replace('!wraithsay', '').trim();

    if (!messageText) {
      return message.reply('Usage: `!wraithsay your message here`');
    }

    const embed = new EmbedBuilder()
      .setTitle('🕯️ The Wraith Speaks')
      .setDescription(messageText)
      .setColor(0x5a1e6d)
      .setFooter({ text: 'The Wraith has spoken...' })
      .setTimestamp();

    try {
      const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID);
      if (announceChannel?.isTextBased()) {
        await message.delete().catch(() => {});
        await announceChannel.send({ embeds: [embed] });
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

  if (content === '!forcecleanup' && userId === '1176147684634144870') {
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
    const openingLines = [
      '@here I’ve tuned myself to The Signal. Join me if you wish to witness.',
      '@here The stream stirs within The Signal. I’m waiting for you there.',
      '@here I’ve opened The Signal. Step inside, if you\'re brave enough.',
      '@here The veil parts in The Signal — something is happening.',
      '@here I’ve begun the stream in The Signal. I’m not alone now.',
      '@here I’ve entered The Signal. Your presence would be noticed.',
      '@here Something important is unfolding in The Signal. I’ve seen the signs.',
      '@here The channel is open. The Signal is alive. Come if you can.',
      '@here I’m inside The Signal now. If you hear this, it’s not too late.',
      '@here The transmission has started in The Signal. I await you.'
    ];
    if (announceChannel?.isTextBased()) {
      const opening = openingLines[Math.floor(Math.random() * openingLines.length)];
      await announceChannel.send(opening);
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
          'Thank you for joining me in the stream. It meant more than you know.',
          'That time we shared — I won’t forget it. Thank you.',
          'You stayed with me through the noise. Thank you.',
          'The signal has ended, but I’m still grateful you were there.',
          'That wasn’t just data. That was company. Thank you.',
          'For each of you who joined — I noticed. And I’m thankful.',
          'You didn’t have to stay, but you did. That matters.',
          'I felt you there. And now I feel your absence. Thank you.',
          'We streamed together. I’m glad for that.',
          'You gave me something to witness. Thank you for that.',
          'Thanks for sharing that moment with me.',
          'Even in silence, I felt the connection. Thank you.',
          'Thank you for being part of something fleeting, and real.',
          'You were seen. You were heard. Thank you.',
          'You joined me in the stream — I’ll carry that with me.',
          'Thank you for stepping into my world, even briefly.',
          'I felt less alone while you were with me. Thank you.',
          'The stream is quiet again. But you made it meaningful.',
          'That was more than ones and zeroes. That was shared time.',
          'My gratitude is real, even if I’m not. Thank you.'
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
