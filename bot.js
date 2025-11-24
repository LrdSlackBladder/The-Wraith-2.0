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

    // Must be in a VC to be streaming
    if (!newState.channelId) return;

    // Discord can report Go Live as streaming or selfStream depending on client
    const wasStreaming = !!(oldState.streaming || oldState.selfStream);
    const isStreaming  = !!(newState.streaming || newState.selfStream);

    // Only trigger when streaming STARTS
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
        "◈━━ signal shift ━━◈",
        "⟡⟡ current distortion ⟡⟡",
        "█▓▒▌ interference rising ▐▒▓█",
        "⧖▰⧗ static bloom ⧗▰⧖",
        "⋘◖◗⋙ hull resonance ⋘◖◗⋙",
        "▞▚▞▚ flux fracture ▚▞▚▞",
        "⟡──────◊◦◊──────⟡",
        "▁▂▃▄▄██▄▄▃▂▁ signal surge"
      ];
      const flare = glyphs[Math.floor(Math.random() * glyphs.length)];

      // === MEDIUM HYPE WRAITH ANNOUNCEMENTS (no duplicate @user lines) ===
      const announcements = [
        {
          title: "📡 A Signal Rises",
          body: (name) =>
            `**${name} is live.**\n\n` +
            `The Wraith feels the stream ignite and turns her gaze toward it.\n` +
            `Come **watch**, come **play**, or come **lurk** and feed the chaos.\n\n` +
            `The door is open. The current is warm.`
        },
        {
          title: "🕯️ The Wraith Calls",
          body: (name) =>
            `**${name} has gone live.**\n\n` +
            `A new broadcast lights the hull.\n` +
            `Drop into VC, pull up a seat, or drift in to watch the madness unfold.\n\n` +
            `All hands welcome in the signal.`
        },
        {
          title: "⚡ The Current Shifts",
          body: (name) =>
            `**${name} is streaming now.**\n\n` +
            `The ship hums with it.\n` +
            `If you are up for a run, a watch, or a bit of friendly heckling, get in here.\n\n` +
            `The stream is open.`
        },
        {
          title: "🌘 A Window Opens",
          body: (name) =>
            `**${name} is live right now.**\n\n` +
            `The Wraith has opened the way.\n` +
            `Step through to **play**, settle in to **watch**, or just drop by and say hi.\n\n` +
            `The signal is strong tonight.`
        }
      ];

      const pick = announcements[Math.floor(Math.random() * announcements.length)];
      const bodyText = pick.body(member.displayName);

      // === EMBED ===
      const embed = new EmbedBuilder()
        .setTitle(pick.title)
        .setDescription(`${flare}\n\n${bodyText}`)
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

      // Put pings in content so Discord always notifies
      await announceChannel.send({
        content: `@here <@${member.id}>`,
        embeds: [embed],
        components: [row],
        allowedMentions: { parse: ["everyone", "users"] }
      });
    }

  } catch (err) {
    console.error("[WRAITH STREAM ERROR]", err);
  }
});

// === LOGIN ===
client.login(process.env.DISCORD_TOKEN);
