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

    // Only trigger on stream start
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

      // === REFINED CHAOTIC GLYPHS (top flare) ===
      const glyphs = [
        "◈─── signal shift detected ───◈",
        "⟡⟡ ⟢ current distortion ⟣ ⟡⟡",
        "█▓▒▌ interference rising ▐▒▓█",
        "⧖▰⧗ static bloom ⧗▰⧖",
        "⋘◖◗⋙ hull resonance ⋘◖◗⋙",
        "▞▚▞▚ flux fracture ▚▞▚▞",
        "⟡──────◊◦◊──────⟡",
        "▁▂▃▄▄██▄▄▃▂▁  signal surge"
      ];
      const glyphLine = glyphs[Math.floor(Math.random() * glyphs.length)];

      // === MEDIUM-HYPE WRAITH ANNOUNCEMENTS ===
      const announcements = [
        {
          title: "📡 A Signal Rises",
          body: (id) =>
            `**<@${id}> is live.**\n\n` +
            `The Wraith feels the stream ignite and turns her gaze toward it.\n` +
            `If you are up for **watching**, **playing**, or just **lurking in the dark**, come through.\n\n` +
            `The door is open. The current is warm.`
        },
        {
          title: "🕯️ The Wraith Calls",
          body: (id) =>
            `**<@${id}> has gone live.**\n\n` +
            `A new broadcast has lit the hull.\n` +
            `Pull up a chair, drop into VC, or drift in to watch the chaos unfold.\n\n` +
            `Either way, you are welcome in the signal.`
        },
        {
          title: "⚡ The Current Shifts",
          body: (id) =>
            `**<@${id}> is streaming now.**\n\n` +
            `The ship hums with it. The static parts for it.\n` +
            `Come join the run, come watch the run, or come heckle lovingly from the shadows.\n\n` +
            `All hands welcome.`
        },
        {
          title: "🌘 A Window Opens",
          body: (id) =>
            `**<@${id}> just went live.**\n\n` +
            `The Wraith has opened the way.\n` +
            `If you want in, step through. If you want to watch, settle in.\n\n` +
            `The signal is strong tonight.`
        }
      ];

      const pick = announcements[Math.floor(Math.random() * announcements.length)];

      // === EMBED ===
      const embed = new EmbedBuilder()
        .setTitle(pick.title)
        .setDescription(
          `${glyphLine}\n\n` +
          `@here <@${member.id}>\n\n` +
          pick.body(member.id)
        )
        .setColor(0x5a1e6d)
        .setFooter({ text: "The Wraith listens…" })
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
