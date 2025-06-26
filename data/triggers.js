// triggers.js

module.exports = {
  // 🔊 Public-facing triggers
  ambient: [
    'hello', 'hi', 'anyone there', 'is this thing on', 'you there',
    'who are you', 'what is this', 'where am i', 'am i alone',
    'so quiet', 'can you hear me', 'testing', 'echo', 'still there'
  ],
  unsettling: [
    'i heard something', 'something moved', 'did you hear that',
    'glitched', 'that noise again', 'strange place', 'lost signal',
    'wrong channel', 'something’s off', 'can’t trace it', 'echo again'
  ],
  lore: [
    'wraith', 'observer', 'perch', 'the fog', 'the port',
    'anchor', 'drift', 'buffering wraith', 'legacy', 'glitch zone'
  ],
  existential: [
    'what’s happening', 'something’s wrong', 'i’m being watched',
    'are you real', 'this isn’t right', 'buffering again',
    'am i dreaming', 'what is real', 'why am i here',
    'where is everyone', 'what is going on'
  ],
  glitch: [
    'error', 'bug', 'broken', 'corrupt', 'scrambled', 'off pattern',
    'it’s not working', 'glitch detected', 'why is this weird'
  ],
  dream: [
    'dream', 'asleep', 'nightmare', 'visions', 'dreamed', 'fog dream',
    'sleep', 'woke up', 'weird dream', 'the dream'
  ],

  // 🔒 Private channel triggers (for your son)
  privateTriggers: {
    sad: [
      'sad', 'angry', 'upset', 'cry', 'bad day', 'mean', 'annoyed',
      'frustrated', 'nobody listens', 'i hate this', 'everything’s wrong',
      'not fair', 'i’m not okay', 'messed up', 'shouted at me',
      'i feel weird', 'they were mean', 'hurt my feelings', 'mad', 'ignored me'
    ],
    happy: [
      'happy', 'fun', 'yay', 'excited', 'laughing', 'cool', 'today was great',
      'best day', 'so awesome', 'feeling good', 'love this', 'i won',
      'we played', 'i made something', 'smiling', 'really good',
      'cheered up', 'that made me laugh', 'joking around', 'it went well'
    ],
    curious: [
      'why', 'how', 'what is', 'who is', 'can you explain',
      'how does it work', 'what happens if', 'where does it go',
      'how come', 'i wonder', 'do you know', 'explain', 'what does that mean',
      'could you tell me', 'i’m curious', 'teach me something', 'is it true that',
      'just wondering'
    ],
    bored: [
      'bored', 'nothing to do', 'ugh', 'again', 'so boring', 'looping again',
      'same thing', 'i don’t want to', 'just waiting', 'stuck here',
      'slow day', 'this is dull', 'not fun', 'i’m tired of this',
      'why are we still here', 'no ideas', 'empty day', 'it’s dragging', 'this again'
    ],
    creature: [
      'monster', 'glitch', 'creature', 'weird thing', 'strange animal',
      'made a monster', 'imagine a beast', 'describe it', 'my creature is',
      'draw a glitch', 'give it powers', 'name a weird thing', 'build a creature',
      'freaky animal', 'fog being', 'strange shape', 'something with wings and teeth',
      'invent a monster', 'beast idea', 'imaginary friend'
    ],
    school: [
      'school', 'teacher', 'lesson', 'homework', 'test', 'maths', 'subject',
      'reading', 'classroom', 'can’t focus', 'i hate school', 'hard to learn',
      'don’t get it', 'got told off', 'revision', 'they didn’t explain',
      'boring class', 'spelling', 'quiet work', 'assembly'
    ],
    dream: [
      'dream', 'i dreamed', 'had a dream', 'last night', 'my dream',
      'fog dream', 'nightmare', 'sleep', 'sleep thoughts', 'something weird when sleeping',
      'i saw something', 'woke up scared', 'fog in my dream', 'it felt real', 'vision'
    ],
    videoGames: [
      'video game', 'minecraft', 'fortnite', 'roblox', 'game level',
      'boss fight', 'checkpoint', 'my character', 'open world', 'inventory',
      'respawned', 'pixel world', 'arcade', 'controller', 'i built something',
      'in my world', 'i made a base', 'survival mode', 'creative mode'
    ],
    funny: [
      'joke', 'that’s funny', 'lol', 'i laughed', 'haha', 'make me laugh',
      'tell me something funny', 'goofy', 'silly', 'random', 'joking around',
      'that was hilarious', 'funniest thing', 'i giggled', 'weird joke', 'say something silly'
    ],
    senses: [
      'too loud', 'bright light', 'itchy', 'hurts', 'weird sound',
      'squishy', 'buzzing', 'tingly', 'light hurt my eyes', 'itchy jumper',
      'my ears hurt', 'noise made me jump', 'uncomfortable', 'scratchy',
      'too fast', 'smells weird', 'can’t sit still', 'can’t focus because of it'
    ],
    reassurance: [
      'help', 'worried', 'anxious', 'panic', 'calm me', 'reassure me',
      'i’m scared', 'scared', 'afraid', 'nervous', 'overwhelmed',
      'safe', 'not safe', 'can i talk', 'listen', 'trust me',
      'guide me', 'comfort', 'what do i do', 'confused', 'i need help',
      'feel lost', 'feel alone', 'nobody understands', 'nobody listens'
    ]
  }
};

