// triggers.js

module.exports = {
  // 🔊 Public-facing triggers
  ambient: [
    'hello', 'hi', 'hey', 'anyone', 'there', 'testing', 'echo',
    'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
    'who', 'this', 'where', 'presence', 'signal'
  ],

  unsettling: [
    'heard', 'something', 'noise', 'moved', 'glitch', 'glitched',
    'strange', 'weird', 'wrong', 'off', 'echo', 'trace', 'disturbance',
    'unusual', 'flicker', 'creepy', 'disruption'
  ],

  lore: [
    'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
    'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes'
  ],

  existential: [
    'real', 'watched', 'happening', 'right', 'dreaming', 'alone',
    'exist', 'reality', 'wrong', 'perception', 'why', 'what', 'meaning',
    'matter', 'question', 'lost', 'forgotten'
  ],

  glitch: [
    'error', 'bug', 'broken', 'corrupt', 'scrambled', 'pattern', 'glitch',
    'weird', 'issue', 'malfunction', 'fault', 'misplaced', 'crash', 'code',
    'debug', 'problem'
  ],

  dream: [
    'dream', 'sleep', 'asleep', 'nightmare', 'visions', 'fog', 'drifted',
    'dreamed', 'woke', 'mind', 'sleeping', 'memory', 'saw', 'vision', 'felt'
  ],

  // 🔒 Private channel triggers (including public triggers)
  privateTriggers: {
    sad: [
      'sad', 'angry', 'upset', 'cry', 'mean', 'frustrated', 'hate',
      'ignored', 'shouted', 'unfair', 'messed', 'bad', 'hurt', 'mad',
      'not okay', 'they were mean', 'nobody', 'feel weird', 'hurt feelings'
    ],

    happy: [
      'happy', 'fun', 'excited', 'laugh', 'yay', 'cool', 'great',
      'awesome', 'smiling', 'won', 'played', 'made', 'best', 'joking',
      'cheered', 'feeling good', 'good mood', 'bright day'
    ],

    curious: [
      'why', 'how', 'what', 'who', 'explain', 'wonder', 'question',
      'tell me', 'learn', 'teach', 'happens', 'know', 'curious', 'could you',
      'true that', 'meaning', 'where does', 'how come'
    ],

    bored: [
      'bored', 'boring', 'again', 'loop', 'same', 'stuck', 'nothing',
      'waiting', 'dull', 'tired', 'no ideas', 'dragging', 'ugh', 'repeating',
      'slow', 'day is slow', 'waste'
    ],

    creature: [
      'monster', 'glitch', 'creature', 'beast', 'animal', 'describe',
      'draw', 'powers', 'tentacles', 'wings', 'weird thing', 'strange',
      'made up', 'build', 'invent', 'fangs', 'eyes', 'name it'
    ],

    school: [
      'school', 'teacher', 'lesson', 'homework', 'test', 'subject',
      'reading', 'class', 'boring', 'revision', 'focus', 'don’t get',
      'got told off', 'maths', 'spelling', 'assembly', 'learning'
    ],

    dream: [
      'dream', 'dreamed', 'nightmare', 'asleep', 'sleep', 'drifted',
      'vision', 'saw', 'weird dream', 'memory', 'felt real', 'fog dream',
      'woke up', 'strange', 'dreamt'
    ],

    videoGames: [
      'game', 'minecraft', 'fortnite', 'roblox', 'checkpoint', 'level',
      'boss', 'respawn', 'inventory', 'creative', 'survival', 'built',
      'controller', 'pixel', 'arcade', 'character', 'base', 'open world'
    ],

    funny: [
      'joke', 'funny', 'lol', 'laugh', 'haha', 'giggle', 'silly',
      'goofy', 'hilarious', 'random', 'tell me a joke', 'made me laugh',
      'laughing', 'weird joke', 'say something silly'
    ],

    senses: [
      'loud', 'bright', 'itchy', 'hurts', 'noise', 'buzzing',
      'tingly', 'scratchy', 'uncomfortable', 'smells', 'can’t sit',
      'too fast', 'too bright', 'too noisy', 'overload', 'focus'
    ],

    reassurance: [
      'help', 'worried', 'anxious', 'panic', 'calm', 'reassure', 'scared',
      'afraid', 'nervous', 'safe', 'lost', 'confused', 'alone',
      'overwhelmed', 'talk', 'listen', 'trust', 'comfort', 'not okay'
    ],

    // ✅ Public triggers added to private context
    ambient: [
      'hello', 'hi', 'hey', 'anyone', 'there', 'testing', 'echo',
      'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
      'who', 'this', 'where', 'presence', 'signal'
    ],

    unsettling: [
      'heard', 'something', 'noise', 'moved', 'glitch', 'glitched',
      'strange', 'weird', 'wrong', 'off', 'echo', 'trace', 'disturbance',
      'unusual', 'flicker', 'creepy', 'disruption'
    ],

    lore: [
      'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
      'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes'
    ],

    existential: [
      'real', 'watched', 'happening', 'right', 'dreaming', 'alone',
      'exist', 'reality', 'wrong', 'perception', 'why', 'what', 'meaning',
      'matter', 'question', 'lost', 'forgotten'
    ],

    glitch: [
      'error', 'bug', 'broken', 'corrupt', 'scrambled', 'pattern', 'glitch',
      'weird', 'issue', 'malfunction', 'fault', 'misplaced', 'crash', 'code',
      'debug', 'problem'
    ]
  }
};
