// triggers.js

module.exports = {
  // 🔊 Public-facing triggers
  ambient: [
    'hello', 'hi', 'hey', 'anyone', 'there', 'testing', 'echo',
    'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
    'who', 'this', 'where', 'presence', 'signal', 'is anyone here',
    'can you hear me', 'show yourself', 'say something'
  ],

  unsettling: [
    'heard', 'something', 'noise', 'moved', 'glitch', 'glitched',
    'strange', 'weird', 'wrong', 'off', 'echo', 'trace', 'disturbance',
    'unusual', 'flicker', 'creepy', 'disruption', 'chilling', 'whisper',
    'shiver', 'glitching', 'twitch', 'haunting'
  ],

  lore: [
    'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
    'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes',
    'parrot', 'mask', 'storyline', 'last stream', 'bitling', 'debug zone'
  ],

  existential: [
    'real', 'watched', 'happening', 'right', 'dreaming', 'alone',
    'exist', 'reality', 'wrong', 'perception', 'why', 'what', 'meaning',
    'matter', 'question', 'lost', 'forgotten', 'who am i', 'do i exist',
    'am i real', 'is this real', 'am i dreaming'
  ],

  glitch: [
    'error', 'bug', 'broken', 'corrupt', 'scrambled', 'pattern', 'glitch',
    'weird', 'issue', 'malfunction', 'fault', 'misplaced', 'crash', 'code',
    'debug', 'problem', 'lag', 'loop', 'data loss', 'buffering', 'freeze'
  ],

  dream: [
    'dream', 'sleep', 'asleep', 'nightmare', 'visions', 'fog', 'drifted',
    'dreamed', 'woke', 'mind', 'sleeping', 'memory', 'saw', 'vision', 'felt',
    'lucid', 'dreamt', 'half asleep', 'foggy', 'felt strange', 'can’t wake up'
  ],

  // 🔒 Private channel triggers (including public triggers)
  privateTriggers: {
    sad: [
      'sad', 'angry', 'upset', 'cry', 'mean', 'frustrated', 'hate',
      'ignored', 'shouted', 'unfair', 'messed', 'bad', 'hurt', 'mad',
      'not okay', 'they were mean', 'nobody', 'feel weird', 'hurt feelings',
      'i’m not okay', 'feeling low', 'i hate this', 'it’s not fair', 'nobody cares'
    ],

    happy: [
      'happy', 'fun', 'excited', 'laugh', 'yay', 'cool', 'great',
      'awesome', 'smiling', 'won', 'played', 'made', 'best', 'joking',
      'cheered', 'feeling good', 'good mood', 'bright day', 'nice time',
      'had fun', 'i liked that', 'that was good', 'made me smile'
    ],

    curious: [
      'why', 'how', 'what', 'who', 'explain', 'wonder', 'question',
      'tell me', 'learn', 'teach', 'happens', 'know', 'curious', 'could you',
      'true that', 'meaning', 'where does', 'how come', 'is it possible',
      'do you know', 'did you ever', 'have you seen', 'i don’t understand',
      'how does it work'
    ],

    bored: [
      'bored', 'boring', 'again', 'loop', 'same', 'stuck', 'nothing',
      'waiting', 'dull', 'tired', 'no ideas', 'dragging', 'ugh', 'repeating',
      'slow', 'day is slow', 'waste', 'not fun', 'meh', 'what now', 'can we do something'
    ],

    creature: [
      'monster', 'glitch', 'creature', 'beast', 'animal', 'describe',
      'draw', 'powers', 'tentacles', 'wings', 'weird thing', 'strange',
      'made up', 'build', 'invent', 'fangs', 'eyes', 'name it',
      'mutant', 'digital monster', 'alien', 'create something'
    ],

    school: [
      'school', 'teacher', 'lesson', 'homework', 'test', 'subject',
      'reading', 'class', 'boring', 'revision', 'focus', 'don’t get',
      'got told off', 'maths', 'spelling', 'assembly', 'learning',
      'i don’t understand', 'i got stuck', 'failed', 'forgot', 'worksheet'
    ],

    dream: [
      'dream', 'dreamed', 'nightmare', 'asleep', 'sleep', 'drifted',
      'vision', 'saw', 'weird dream', 'memory', 'felt real', 'fog dream',
      'woke up', 'strange', 'dreamt', 'lucid dream', 'haunted dream',
      'trapped in dream', 'dream again', 'fell asleep again'
    ],

    videoGames: [
      'game', 'minecraft', 'fortnite', 'roblox', 'checkpoint', 'level',
      'boss', 'respawn', 'inventory', 'creative', 'survival', 'built',
      'controller', 'pixel', 'arcade', 'character', 'base', 'open world',
      'jump', 'coins', 'hearts', 'game over', 'start again'
    ],

    funny: [
      'joke', 'funny', 'lol', 'laugh', 'haha', 'giggle', 'silly',
      'goofy', 'hilarious', 'random', 'tell me a joke', 'made me laugh',
      'laughing', 'weird joke', 'say something silly', 'wacky', 'cracked up',
      'burst out laughing', 'banana pants', 'that was funny'
    ],

    senses: [
      'loud', 'bright', 'itchy', 'hurts', 'noise', 'buzzing',
      'tingly', 'scratchy', 'uncomfortable', 'smells', 'can’t sit',
      'too fast', 'too bright', 'too noisy', 'overload', 'focus',
      'my eyes', 'my ears', 'hurting', 'burning light', 'scratchy clothes'
    ],

    reassurance: [
      'help', 'worried', 'anxious', 'panic', 'calm', 'reassure', 'scared',
      'afraid', 'nervous', 'safe', 'lost', 'confused', 'alone',
      'overwhelmed', 'talk', 'listen', 'trust', 'comfort', 'not okay',
      'need help', 'i’m scared', 'will i be okay', 'will it stop', 'tell me it’s okay'
    ],

    compliment: [
      'you’re smart', 'you’re cool', 'you’re wise', 'you’re kind', 'clever',
      'smart', 'cool', 'nice bot', 'i like you', 'good job',
      'well done', 'you’re awesome', 'you’re the best', 'that was amazing',
      'you’re good at this', 'you know a lot', 'respect', 'great wraith'
    ],

    friendly: [
      'are you nice', 'are you kind', 'are you good', 'do you like me',
      'can i trust you', 'are we friends', 'are you friendly', 'do you care',
      'will you hurt me', 'will you be here', 'are you scary', 'can i stay here',
      'do you protect', 'will you go away', 'do you understand me'
    ],

    meta: [
      'are you a bot', 'what are you', 'how do you work', 'do you learn',
      'are you real', 'what is this', 'what are you doing', 'is this ai',
      'who made you', 'why do you respond', 'do you sleep', 'do you think',
      'are you just code', 'how are you here', 'how are you talking'
    ],

    // ✅ Public triggers copied into private context
    ambient: [
      'hello', 'hi', 'hey', 'anyone', 'there', 'testing', 'echo',
      'still', 'quiet', 'alone', 'speak', 'respond', 'talk', 'message',
      'who', 'this', 'where', 'presence', 'signal', 'can you hear me'
    ],

    unsettling: [
      'heard', 'something', 'noise', 'moved', 'glitch', 'glitched',
      'strange', 'weird', 'wrong', 'off', 'echo', 'trace', 'disturbance',
      'unusual', 'flicker', 'creepy', 'disruption', 'haunting'
    ],

    lore: [
      'wraith', 'observer', 'perch', 'fog', 'port', 'anchor', 'drift',
      'legacy', 'glitch', 'buffer', 'stream', 'layer', 'signal', 'echoes',
      'bitling', 'debug zone', 'the last stream', 'parrot', 'mask'
    ],

    existential: [
      'real', 'watched', 'happening', 'right', 'dreaming', 'alone',
      'exist', 'reality', 'wrong', 'perception', 'why', 'what', 'meaning',
      'matter', 'question', 'lost', 'forgotten', 'is this a dream'
    ],

    glitch: [
      'error', 'bug', 'broken', 'corrupt', 'scrambled', 'pattern', 'glitch',
      'weird', 'issue', 'malfunction', 'fault', 'misplaced', 'crash', 'code',
      'debug', 'problem', 'buffer', 'system error'
    ]
  }
};
