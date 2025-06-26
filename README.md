# WRAITH Observer Bot

A lore-aware, ambient Discord bot designed for immersive storytelling and community engagement inside a surreal narrative universe. Originally created for *The Last Stream of Slacky*, this bot listens, observes, and gently reacts to trigger phrases and user behavior with eerie, poetic presence.

---

## 🧠 Features

- 🎭 **Role Automation**
  - New members automatically receive `Wraith Crew`
  - Users who stream in voice channels gain `Signal Watcher`
  - Inactive `Signal Watchers` revert to `Wraith Crew` after 14 days

- 🌫️ **Lore-Aware Ambient Replies**
  - Responds to certain messages with randomly selected phrases across categories like `ambient`, `existential`, `unsettling`, and `lore`
  - Users with the `Signal Watcher` role may receive rare `loreExclusive` echoes

- 📡 **@Mention Response**
  - Pinging the WRAITH directly triggers a personalised reply with a delay to simulate attention and thought

- 🧹 **Automatic Channel Cleanup**
  - Periodically deletes messages over 24 hours old in a specified channel

- 🕰️ **Heartbeat Logger**
  - Logs a heartbeat every 5 minutes to keep the bot alive on platforms like Railway

---

## ⚙️ Setup & Deployment

### 1. Clone the Project

```bash
git clone https://github.com/yourname/wraith-observer.git
cd wraith-observer
