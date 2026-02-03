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
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildScheduledEvents
  ]
});

// === CONFIG ===
const EVENT_ANNOUNCE_CHANNEL_ID  = '1440692270989967442'; // general event announcements
const STREAM_ANNOUNCE_CHANNEL_ID = '1339149195688280085'; // stream announcements

// Stream toggle cooldown per user
const STREAM_USER_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes
const streamCooldowns = new Map();

// Auto-delete stream announcements (general) after 4 hours
const STREAM_AUTO_DELETE_MS = 4 * 60 * 60 * 1000; // 4 hours

// Event announcement memory (to prevent repeats)
const announcedEvents = new Map();
// This is NOT the announce timing. It is how long we remember announced events to prevent repeats.
const ANNOUNCE_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// === STYLE POOLS ===
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

const genericEventTitles = [
  (n) => `⏳ Incoming in 6 hours: ${n}`,
  (n) => `📣 Ahead on the current: ${n}`,
  (n) => `🕯️ Tonight in the Perch: ${n}`,
  (n) => `⚡ Event forming: ${n}`,
  (n) => `🌘 The schedule stirs: ${n}`
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function wraithLineForEvent() {
  return pick([
    "The Wraith feels the timetable shift. Six hours remain.",
    "A quiet tremor runs through the hull. Something is on the way.",
    "The current bends toward the coming hour. Mark it now.",
    "The ship has begun to make room for what is due.",
    "The Perch will gather when the time comes. Six hours to go.",
    "Something stirs in the schedule. The Wraith is already listening.",
    "A soft pull in the signal says: remember this time.",
    "The hours tilt toward us. Let the thought settle early."
  ]);
}

// Helper: fetch channel safely (cache first, then API)
async function getTextChannel(guild, channelId) {
  let ch = guild.channels.cache.get(channelId);
  if (!ch) {
    try {
      ch = await guild.channels.fetch(channelId);
    } catch {
      ch = null;
    }
  }
  return ch?.isTextBased() ? ch : null;
}

// === READY ===
client.once('ready', () => {
  console.log(`[WRAITH BOT] Online as ${client.user.tag}`);

  // === SCHEDULED EVENT ANNOUNCER (NO CRON, SAFE FOR RAILWAY) ===
  setInterval(async () => {
    const now = Date.now();

    // Cleanup old entries from memory cache
    for (const [key, ts] of announcedEvents.entries()) {
      if (now - ts > ANNOUNCE_CACHE_TTL_MS) announcedEvents.delete(key);
    }

    for (const guild of client.guilds.cache.values()) {
      let events;
      try {
        events = await guild.scheduledEvents.fetch();
      } catch (err) {
        console.error("[WRAITH EVENT FETCH ERROR]", err);
        continue;
      }

      const upcoming = events.filter(ev =>
        ev.scheduledStartTimestamp &&
        ev.status !== 3 // not cancelled
      );

      for (const ev of upcoming.values()) {
        const start = ev.scheduledStartTimestamp;
        const diff = start - now;

        // Announce once when event is within next 6 hours
        const withinSixHours = diff > 0 && diff <= 6 * 60 * 60 * 1000;
        if (!withinSixHours) continue;

        const announceKey = `${ev.id}:${start}`;
        if (announcedEvents.has(announceKey)) continue;

        const announceChannel = await getTextChannel(guild, EVENT_ANNOUNCE_CHANNEL_ID);
        if (!announceChannel) continue;

        const flare = pick(glyphs);
        const line  = wraithLineForEvent();
        const title = pick(genericEventTitles)(ev.name);

        // Build VC link if there is a channel, otherwise fall back to event url
        const vcLink = ev.channelId
          ? `https://discord.com/channels/${guild.id}/${ev.channelId}`
          : null;

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(
            `${flare}\n\n` +
            `${line}\n\n` +
            `Start Time: <t:${Math.floor(start / 1000)}:F>\n` +
            `Countdown: <t:${Math.floor(start / 1000)}:R>\n\n` +
            `If you are drifting in later, anchor this now.`
          )
          .setColor(0x5a1e6d)
          .setFooter({ text: "The Wraith marks the hours…" })
          .setTimestamp();

        // Two buttons: always event card, plus VC if available
        const buttons = [
          new ButtonBuilder()
            .setLabel("Open Event Card")
            .setStyle(ButtonStyle.Link)
            .setURL(ev.url)
        ];

        if (vcLink) {
          buttons.push(
            new ButtonBuilder()
              .setLabel("Join VC")
              .setStyle(ButtonStyle.Link)
              .setURL(vcLink)
          );
        }

        // IMPORTANT: spread buttons into addComponents
        const row = new ActionRowBuilder().addComponents(...buttons);

        // Events: DO NOT auto-delete (handled by your other bot)
        await announceChannel.send({
          content:
            `@here\n` +
            `The card is here if you want the full details: ${ev.url}`,
          embeds: [embed],
          components: [row],
          allowedMentions: { parse: ["everyone"] }
        });

        announcedEvents.set(announceKey, now);
      }
    }
  }, 60 * 1000); // Runs every 60 seconds
});

// === STREAM DETECTION ===
client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    const member = newState.member;
    if (!member) return;

    // Must be in VC
    if (!newState.channelId) return;

    const wasStreaming = !!(oldState.streaming || oldState.selfStream);
    const isStreaming  = !!(newState.streaming || newState.selfStream);

    // Only trigger when streaming STARTS
    if (!wasStreaming && isStreaming) {
      const now = Date.now();
      const last = streamCooldowns.get(member.id) || 0;

      if (now - last < STREAM_USER_COOLDOWN_MS) return;
      streamCooldowns.set(member.id, now);

      const announceChannel = await client.channels.fetch(STREAM_ANNOUNCE_CHANNEL_ID).catch(() => null);
      if (!announceChannel?.isTextBased()) return;

      const guildId = newState.guild.id;
      const voiceChannelId = newState.channelId;
      const vcLink = `https://discord.com/channels/${guildId}/${voiceChannelId}`;

      const flare = pick(glyphs);

      const announcements = [
        {
          title: "📡 A Signal Rises",
          body: 
            `**${name} is live.**\n\n` +
            `The hull hums and the air shifts. Something good is starting.\n` +
            `Come to **watch**, come to **play**, or drift in and keep them company.\n\n` +
            `The door is open and the current is warm.`
        },
        {
          title: "🕯️ The Wraith Calls",
          body: 
            `**${name} has gone live.**\n\n` +
            `A fresh broadcast lights the deck.\n` +
            `If your hands are free, jump in. If your brain is tired, lurk and breathe.\n\n` +
            `Either way, the signal wants you nearby.`
        },
        {
          title: "⚡ The Current Shifts",
          body: 
            `**${name} is streaming now.**\n\n` +
            `You can feel it. The ship does.\n` +
            `Pull up a seat, hop into VC, or roll in late with snacks and chaos.\n\n` +
            `We are live.`
        },
        {
          title: "🌘 A Window Opens",
          body: 
            `**${name} is live right now.**\n\n` +
            `A little tear in the routine. A place to gather.\n` +
            `Drop in for a run, a laugh, or a quiet watch while the world slows down.\n\n` +
            `The Wraith holds the door.`
        },
        {
          title: "🔥 The Perch Assembles",
          body: 
            `**${name} just lit the signal.**\n\n` +
            `No schedule, no warning, just that familiar spark.\n` +
            `If you are around, come be part of it. If not, catch the echo later.\n\n` +
            `The stream is alive.`
        },
        {
          title: "🛰️ Broadcast Detected",
          body: 
            `**${name} is live.**\n\n` +
            `The Wraith caught it the moment it flared.\n` +
            `Whether you join to play or lurk, your presence feeds the vibe.\n\n` +
            `Signal is steady. Come through.`
        }
      ];

      const pickAnnounce = pick(announcements);
      const bodyText = pickAnnounce.body(member.displayName);

      const embed = new EmbedBuilder()
        .setTitle(pickAnnounce.title)
        .setDescription(`${flare}\n\n${bodyText}`)
        .setColor(0x5a1e6d)
        .setFooter({ text: "The Wraith listens…" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Join the Stream")
          .setStyle(ButtonStyle.Link)
          .setURL(vcLink)
      );

      // Streams: auto-delete after 4 hours
      const sent = await announceChannel.send({
        content: `@here <@${member.id}>`,
        embeds: [embed],
        components: [row],
        allowedMentions: { parse: ["everyone", "users"] }
      });

      setTimeout(() => {
        sent.delete().catch(() => {});
      }, STREAM_AUTO_DELETE_MS);
    }
  } catch (err) {
    console.error("[WRAITH STREAM ERROR]", err);
  }
});

// === LOGIN ===
client.login(process.env.DISCORD_TOKEN);
