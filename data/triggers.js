module.exports = {
  // 🔊 Public-facing triggers
  ambient: [
    'hello', 'hi', 'hey', 'greetings', 'anyone', 'there', 'testing', 'echo',
    'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
    'presence', 'signal', 'who', 'this', 'where', 'voice', 'sound', 'notice',
    'reply', 'hear', 'attention', 'listening', 'calling', 'check-in', 'touch'
  ],

  unsettling: [
    'heard', 'noise', 'moved', 'glitch', 'strange', 'weird', 'wrong', 'off',
    'echo', 'disturbance', 'unusual', 'flicker', 'creepy', 'disruption',
    'haunting', 'shiver', 'whisper', 'shadow', 'uneasy', 'anomaly', 'static',
    'cold', 'distorted', 'unsettled', 'tremble', 'ominous', 'dark'
  ],

  lore: [
    'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
    'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes',
    'parrot', 'mask', 'story', 'storyline', 'last stream', 'static memory',
    'cycle', 'anchor point', 'fragment', 'the perch', 'port silt', 'debug zone'
  ],

  existential: [
    'real', 'watched', 'happening', 'dreaming', 'alone', 'exist', 'reality',
    'perception', 'meaning', 'matter', 'question', 'lost', 'forgotten',
    'why', 'what', 'who', 'how', 'am i real', 'is this real', 'do i exist',
    'truth', 'awareness', 'is this a dream', 'identity', 'self', 'presence'
  ],

  glitch: [
    'error', 'bug', 'broken', 'corrupt', 'scrambled', 'pattern', 'issue',
    'malfunction', 'fault', 'crash', 'code', 'debug', 'problem', 'lag',
    'loop', 'freeze', 'reset', 'system', 'data', 'faulty', 'incomplete',
    'unstable', 'glitched', 'buffering', 'out of sync'
  ],

  dream: [
    'dream', 'sleep', 'asleep', 'nightmare', 'visions', 'foggy', 'drifted',
    'woke', 'sleeping', 'memory', 'saw', 'vision', 'felt', 'lucid',
    'dreamt', 'half asleep', 'can’t wake up', 'strange dream', 'trapped',
    'dream state', 'slumber', 'unconscious', 'imagination', 'floating',
    'otherworld', 'phantom', 'subconscious'
  ],

  // 🔒 Private-facing (richer interaction depth)
  privateTriggers: {
    sad: [
      'sad', 'cry', 'upset', 'angry', 'frustrated', 'hate', 'ignored', 'hurt',
      'unfair', 'messed', 'mad', 'low', 'lonely', 'unloved', 'abandoned',
      'unwanted', 'left out', 'shouted', 'tears', 'heartbroken', 'rejected'
    ],

    happy: [
      'happy', 'joy', 'laugh', 'yay', 'fun', 'great', 'smiling', 'excited',
      'best', 'good', 'awesome', 'bright', 'positive', 'glad', 'delighted',
      'cheered', 'good mood', 'had fun', 'sunshine', 'smile', 'giggled'
    ],

    curious: [
      'why', 'how', 'what', 'when', 'who', 'explain', 'wonder', 'tell me',
      'learn', 'teach', 'know', 'curious', 'could you', 'true that',
      'is it possible', 'do you know', 'how does', 'reason', 'logic',
      'what happens', 'what if', 'mystery'
    ],

    bored: [
      'bored', 'boring', 'again', 'loop', 'nothing', 'waiting', 'dull',
      'tired', 'slow', 'ugh', 'meh', 'dragging', 'not fun', 'can we',
      'repeating', 'empty', 'idle', 'day is slow', 'want something', 'need game'
    ],

    creature: [
      'monster', 'creature', 'beast', 'animal', 'build', 'invent', 'fangs',
      'tentacles', 'wings', 'eyes', 'describe', 'mutant', 'alien', 'name it',
      'digital monster', 'new pet', 'glitchbeast', 'spawn', 'creation'
    ],

    school: [
      'school', 'teacher', 'lesson', 'homework', 'test', 'reading', 'class',
      'boring', 'revision', 'focus', 'maths', 'spelling', 'subject',
      'failed', 'worksheet', 'report', 'timetable', 'got told off',
      'grades', 'study', 'exam'
    ],

    dream: [
      'dream', 'dreamed', 'nightmare', 'asleep', 'sleep', 'vision', 'foggy',
      'memory', 'strange dream', 'felt real', 'lucid dream', 'woke up',
      'phantom', 'drifted', 'sleeping', 'haunted dream', 'trapped in dream'
    ],

    videoGames: [
      'game', 'games', 'play', 'level', 'boss', 'respawn', 'checkpoint',
      'inventory', 'creative', 'survival', 'minecraft', 'fortnite', 'roblox',
      'controller', 'pixel', 'arcade', 'jump', 'base', 'hearts', 'coins'
    ],

    funny: [
      'joke', 'funny', 'lol', 'laugh', 'haha', 'giggle', 'silly', 'goofy',
      'hilarious', 'random', 'weird joke', 'say something silly',
      'banana pants', 'cracked up', 'wacky', 'joking', 'snort', 'laughing'
    ],

    senses: [
      'loud', 'bright', 'itchy', 'hurts', 'noise', 'buzzing', 'tingly',
      'scratchy', 'uncomfortable', 'smells', 'too fast', 'overload',
      'too bright', 'too noisy', 'burning light', 'my ears', 'my eyes',
      'can’t sit', 'feels wrong', 'spiky'
    ],

    reassurance: [
      'help', 'worried', 'panic', 'scared', 'anxious', 'afraid', 'nervous',
      'lost', 'confused', 'overwhelmed', 'not okay', 'need help', 'safe',
      'will i be okay', 'talk to me', 'can i trust you', 'alone',
      'need support', 'feel bad', 'please help'
    ],

    ambient: [
      'hello', 'hi', 'hey', 'greetings', 'anyone', 'there', 'testing', 'echo',
      'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
      'presence', 'signal', 'who', 'this', 'where', 'voice', 'notice'
    ],

    unsettling: [
      'heard', 'noise', 'moved', 'glitch', 'strange', 'weird', 'wrong', 'off',
      'echo', 'disturbance', 'flicker', 'creepy', 'disruption', 'shiver',
      'shadow', 'haunting', 'uneasy', 'anomaly', 'cold', 'ghostly'
    ],

    lore: [
      'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
      'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes',
      'parrot', 'mask', 'story', 'storyline', 'static memory', 'ghost signal'
    ],

    existential: [
      'real', 'watched', 'happening', 'dreaming', 'exist', 'reality',
      'perception', 'meaning', 'question', 'lost', 'identity', 'why', 'how',
      'truth', 'awareness', 'presence', 'illusion', 'simulated', 'observer'
    ],

    glitch: [
      'error', 'bug', 'broken', 'corrupt', 'pattern', 'issue', 'crash',
      'debug', 'problem', 'lag', 'loop', 'freeze', 'system', 'data',
      'unstable', 'buffer', 'scrambled', 'malfunction'
    ]
  }
};
