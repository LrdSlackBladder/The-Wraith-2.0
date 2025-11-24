// === ENV SETUP ===
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// === CLIENT ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// === CONFIG ===
const STREAM_ANNOUNCE_CHANNEL_ID = '1339149195688280085';

// Cooldown per user so toggling stream on/off does not spam
const STREAM_USER_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const streamCooldowns = new Map();

// === READY ===
client.once('ready', () => {
  console.log(`[WRAITH STREAM BOT] Online as ${client.user.tag}`);
});

// === STREAM DETECTION ===
client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    const member = newState.member;
    if (!member) return;

    const wasStreaming = oldState.streaming;
    const isStreaming = newState.streaming;

    // Only trigger on STREAM START
    if (!wasStreaming && isStreaming) {
      const now = Date.now();
      const last = streamCooldowns.get(member.id) || 0;

      if (now - last < STREAM_USER_COOLDOWN_MS) return;
      streamCooldowns.set(member.id, now);

      const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID);
      if (!announceChannel?.isTextBased()) return;

      // Direct link to the VC they are streaming in
      const guildId = newState.guild.id;
      const voiceChannelId = newState.channelId;
      const vcLink = `https://discord.com/channels/${guildId}/${voiceChannelId}`;

      // === CHAOTIC WRAITH GLYPHS (top of embed) ===
      const glyphs = [
        "█▓▒░ interference rising ░▒▓█",
        "⟡──────◊◦◊──────⟡",
        "▞▚▞▚ signal fracture ▚▞▚▞",
        "░▒▓ signal tremor detected ▓▒░",
        "▁▂▃▄▄██▄▄▃▂▁",
        "⋘◖◗⋙  current shift  ⋘◖◗⋙",
        "⧖▰⧗  static bloom  ⧗▰⧖",
        "~͟~͞~ signal warped ~͞~͟~"
      ];
      const glyphLine = glyphs[Math.floor(Math.random() * glyphs.length)];

      // === WRAITH WHISPERS ===
      const whispers = [
        "*The currents shift… the hull stirs. A new signal flickers to life.*",
        "*A pulse trembles through her frame… the dark hums in recognition.*",
        "*Shadows lean toward the glow. A broadcast cuts through the quiet.*",
        "*Something awakens in the static… a vision opening into the void.*",
        "*The Wraith feels the ripple — a window into another world begins.*",
        "*A flare of light… a fracture in the silence… the signal rises.*",
        "*An echo spills into the dark — a presence casting itself live.*"
      ];
      const whisper = whispers[Math.floor(Math.random() * whispers.length)];

      // === EMBED ===
      const embed = new EmbedBuilder()
        .setTitle("📡 A Signal Awakens")
        .setDescription(
          `${glyphLine}\n\n` +
          `@here <@${member.id}>\n\n` +
          `${whisper}`
        )
        .setColor(0x5a1e6d)
        .setFooter({ text: "The Wraith stirs…" })
        .setTimestamp();

      // === BUTTON TO VC ===
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Join the Stream")
          .setStyle(ButtonStyle.Link)
          .setURL(vcLink)
      );

      await announceChannel.send({
        embeds: [embed],
        components: [row]
      });
    }
  } catch (err) {
    console.error("[WRAITH STREAM ERROR]", err);
  }
});

// === LOGIN ===
client.login(process.env.DISCORD_TOKEN);
