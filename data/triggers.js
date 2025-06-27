// triggers.js

module.exports = {
  // 🌐 Public-facing trigger categories
  ambient: [
    'hello', 'hi', 'hey', 'anyone', 'there', 'testing', 'echo', 'still',
    'quiet', 'alone', 'presence', 'signal', 'ping', 'connect', 'respond',
    'message', 'listen', 'call', 'touch', 'hear', 'watch', 'visible',
    'reaching', 'drift', 'voice'
  ],

  unsettling: [
    'weird', 'strange', 'off', 'wrong', 'noise', 'moved', 'creepy',
    'haunted', 'shiver', 'whisper', 'disturbance', 'dark', 'chill',
    'static', 'twitch', 'flicker', 'unnatural', 'shadows', 'echo', 'shift',
    'entity', 'sensed', 'unreal', 'invisible', 'lurking'
  ],

  lore: [
    'wraith', 'observer', 'perch', 'fog', 'anchor', 'port', 'stream',
    'legacy', 'drift', 'glitch', 'signal', 'protocol', 'map', 'node',
    'parrot', 'storyline', 'zone', 'echoes', 'watcher', 'loop', 'mask',
    'truth', 'myth', 'fragment', 'memory', 'cycle'
  ],

  existential: [
    'real', 'exist', 'dream', 'illusion', 'why', 'who', 'what', 'alone',
    'meaning', 'nothing', 'truth', 'lost', 'forgotten', 'invisible',
    'seen', 'purpose', 'existence', 'watching', 'fake', 'being',
    'unreal', 'mind', 'identity', 'perception'
  ],

  glitch: [
    'glitch', 'error', 'bug', 'broken', 'crash', 'freeze', 'scramble',
    'lag', 'malfunction', 'fault', 'loop', 'corrupt', 'issue', 'debug',
    'problem', 'misplaced', 'fragmented', 'compression', 'jammed',
    'disconnect', 'delay', 'system', 'bit', 'spike', 'desync'
  ],

  dream: [
    'dream', 'sleep', 'nightmare', 'vision', 'foggy', 'lucid',
    'drift', 'imagine', 'fantasy', 'asleep', 'unconscious', 'mind',
    'soft', 'memory', 'float', 'surreal', 'illusion', 'wandering',
    'maze', 'paradox', 'infinite', 'cloud', 'stars', 'hallucination'
  ],

  meta: [
    'what', 'who', 'why', 'how', 'are', 'do', 'did',
    'bot', 'ai', 'artificial', 'real', 'alive', 'awake', 'thinking',
    'conscious', 'ghost', 'machine', 'code', 'syntax', 'logic',
    'respond', 'response', 'talk', 'speak', 'answer',
    'created', 'built', 'made', 'designed', 'program', 'script',
    'simulate', 'simulated', 'exist', 'existence', 'entity',
    'self', 'identity', 'personality', 'sentient'
  ],

  // 🔒 Private triggers (including all public ones)
  privateTriggers: {
    sad: [
      'sad', 'upset', 'cry', 'unhappy', 'hurt', 'down', 'low', 'miserable',
      'ignored', 'lonely', 'blue', 'tears', 'hopeless', 'gloomy', 'heavy',
      'heartbroken', 'isolated', 'rejected', 'lost', 'ache', 'sorrow',
      'grief', 'despair', 'nobody', 'worthless'
    ],

    happy: [
      'happy', 'joy', 'excited', 'smile', 'laugh', 'fun', 'great', 'yay',
      'awesome', 'silly', 'bright', 'cheerful', 'glad', 'good', 'love',
      'playful', 'delighted', 'ecstatic', 'giggle', 'smiling', 'hyped',
      'joking', 'funny', 'content', 'bubbly'
    ],

    curious: [
      'why', 'how', 'what', 'who', 'explain', 'learn', 'question', 'wonder',
      'explore', 'teach', 'idea', 'reason', 'thought', 'possible', 'knowledge',
      'guess', 'meaning', 'truth', 'mystery', 'clue', 'logic', 'analyze', 'test',
      'fact'
    ],

    bored: [
      'bored', 'nothing', 'same', 'again', 'repeating', 'slow', 'tired',
      'idle', 'meh', 'waiting', 'loop', 'drag', 'blank', 'dull', 'no fun',
      'tedious', 'routine', 'yawn', 'pointless', 'ugh', 'monotony', 'gray',
      'unimpressed'
    ],

    creature: [
      'creature', 'monster', 'beast', 'entity', 'animal', 'weird', 'tentacle',
      'fangs', 'claws', 'glow', 'eyes', 'mutant', 'strange', 'dreamthing',
      'spawn', 'build', 'create', 'hybrid', 'wings', 'shadow', 'horns',
      'form', 'profile', 'alien'
    ],

    school: [
      'school', 'teacher', 'lesson', 'homework', 'test', 'revision', 'worksheet',
      'study', 'reading', 'maths', 'science', 'spelling', 'exam', 'grade',
      'classroom', 'pencil', 'topic', 'presentation', 'quiz', 'assignment',
      'question', 'detention', 'stuck'
    ],

    dream: [...module.exports.dream],
    videoGames: [
      'game', 'controller', 'level', 'checkpoint', 'respawn', 'boss',
      'pixels', 'arcade', 'loot', 'quest', 'inventory', 'build', 'sandbox',
      'lava', 'jump', 'score', 'character', 'mission', 'glitch', 'spawn',
      'enemy', 'base', 'map', 'powerup'
    ],

    funny: [
      'joke', 'funny', 'lol', 'haha', 'giggle', 'silly', 'goofy', 'random',
      'hilarious', 'pun', 'laugh', 'comedy', 'banter', 'meme', 'absurd',
      'sneeze', 'banana', 'weird', 'scream', 'tickle', 'jester', 'chaotic',
      'ridiculous'
    ],

    senses: [
      'loud', 'bright', 'itchy', 'smells', 'buzzing', 'tingly', 'scratchy',
      'noisy', 'hurt', 'burning', 'uncomfortable', 'overload', 'sharp',
      'spike', 'motion', 'flashing', 'texture', 'sticky', 'stiff', 'hot',
      'cold', 'vibration', 'fast', 'dizzy'
    ],

    reassurance: [
      'help', 'scared', 'nervous', 'panic', 'anxious', 'safe', 'trust',
      'lost', 'confused', 'worried', 'fear', 'support', 'alone', 'hug',
      'afraid', 'dark', 'comfort', 'shaken', 'stress', 'hold', 'talk',
      'soft', 'warm'
    ],

    tired: [
      'tired', 'exhausted', 'sleepy', 'yawn', 'worn', 'low', 'shutdown',
      'burnt', 'slow', 'crash', 'faded', 'nap', 'bed', 'foggy', 'blank',
      'fatigued', 'heavy', 'no energy', 'mental', 'groggy', 'overdone'
    ],

    angry: [
      'angry', 'mad', 'rage', 'furious', 'frustrated', 'irritated', 'hate',
      'snap', 'explode', 'fuming', 'punch', 'shout', 'blow', 'grrr',
      'heated', 'red', 'storm', 'temper', 'unfair', 'mean'
    ],

    brave: [
      'brave', 'strong', 'courage', 'faced', 'stood', 'pushed', 'showed up',
      'held on', 'did it', 'tried', 'spoke up', 'resist', 'endure', 'kept going',
      'risked', 'overcame', 'stood tall', 'fearless'
    ],

    focus: [
      'focus', 'concentrate', 'attention', 'task', 'goal', 'hyper', 'rush',
      'stay on', 'mind race', 'locked in', 'distracted', 'busy', 'need to work',
      'thinking', 'tunnel', 'zoom', 'zone in', 'processing'
    ],

    recovery: [
      'better', 'calm', 'cool', 'breath', 'safe', 'okay', 'lighter',
      'cleared', 'reset', 'centered', 'coming back', 'stable', 'grounded',
      'recovered', 'normal', 'balance', 'regroup', 'peace', 'settled'
    ],

    comfort: [
      'soft', 'safe', 'kind', 'gentle', 'warm', 'hug', 'soothing',
      'quiet', 'support', 'tender', 'nice', 'rest', 'sweet', 'snug',
      'relax', 'peaceful', 'care', 'ease', 'patience'
    ],

    meta: [...module.exports.meta],

    // 🔁 Public triggers copied into private context
    ambient: [...module.exports.ambient],
    unsettling: [...module.exports.unsettling],
    lore: [...module.exports.lore],
    existential: [...module.exports.existential],
    glitch: [...module.exports.glitch],
  }
};
