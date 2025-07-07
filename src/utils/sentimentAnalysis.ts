
// Simple sentiment analysis using VADER-like approach
// This is a lightweight implementation for the MVP

const positiveWords = [
  'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent',
  'good', 'nice', 'pleasant', 'delighted', 'cheerful', 'optimistic', 'confident',
  'grateful', 'thankful', 'blessed', 'peaceful', 'calm', 'relaxed', 'content',
  'motivated', 'inspired', 'hopeful', 'proud', 'accomplished', 'successful'
];

const negativeWords = [
  'sad', 'depressed', 'anxious', 'worried', 'stressed', 'upset', 'angry', 'frustrated',
  'disappointed', 'hurt', 'pain', 'suffering', 'lonely', 'isolated', 'hopeless',
  'overwhelmed', 'exhausted', 'tired', 'sick', 'terrible', 'awful', 'horrible',
  'scared', 'afraid', 'nervous', 'panic', 'crisis', 'struggle', 'difficult', 'hard'
];

const intensifiers = ['very', 'extremely', 'really', 'so', 'quite', 'pretty', 'rather'];
const negators = ['not', 'never', 'no', 'none', 'neither', 'nobody', 'nothing'];

export const analyzeSentiment = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let wordCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i].replace(/[^\w]/g, ''); // Remove punctuation
    
    if (positiveWords.includes(word)) {
      let currentScore = 1;
      
      // Check for intensifiers
      if (i > 0 && intensifiers.includes(words[i - 1])) {
        currentScore *= 1.5;
      }
      
      // Check for negators
      if (i > 0 && negators.includes(words[i - 1])) {
        currentScore *= -0.5;
      }
      
      score += currentScore;
      wordCount++;
    } else if (negativeWords.includes(word)) {
      let currentScore = -1;
      
      // Check for intensifiers
      if (i > 0 && intensifiers.includes(words[i - 1])) {
        currentScore *= 1.5;
      }
      
      // Check for negators (double negative = positive)
      if (i > 0 && negators.includes(words[i - 1])) {
        currentScore *= -0.5;
      }
      
      score += currentScore;
      wordCount++;
    }
  }

  // Normalize score between -1 and 1
  if (wordCount === 0) return 0;
  
  const normalizedScore = score / Math.max(wordCount, 1);
  return Math.max(-1, Math.min(1, normalizedScore));
};

export const getCopingTip = (sentimentScore: number): string => {
  const positiveTips = [
    "You're doing great! Keep nurturing these positive feelings with activities you enjoy.",
    "Your positive energy is wonderful. Consider sharing this good mood with someone who might need it.",
    "It's beautiful that you're feeling good. Remember this moment for times when you need encouragement.",
    "Positivity suits you! Try to identify what's contributing to these good feelings.",
    "You're in a great headspace. This is a perfect time to tackle something you've been putting off."
  ];

  const neutralTips = [
    "It's okay to have neutral days. Sometimes just being present is enough.",
    "Steady and calm is a good place to be. Consider doing something small that brings you joy.",
    "Neutral feelings are valid too. Maybe try a gentle activity like a short walk or deep breathing.",
    "You're holding steady, which takes strength. Be kind to yourself today.",
    "Sometimes the most peaceful days feel neutral. That's perfectly fine."
  ];

  const negativeTips = [
    "Difficult emotions are temporary. Try taking 5 deep breaths and focus on one thing you're grateful for.",
    "It's brave of you to share these feelings. Consider reaching out to someone you trust or a mental health professional.",
    "You're not alone in feeling this way. Try gentle movement, like stretching or a short walk.",
    "These feelings will pass. Focus on basic self-care: water, food, rest, and fresh air.",
    "Hard days happen to everyone. Be as kind to yourself as you would be to a good friend.",
    "Your feelings are valid. Consider trying a grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear.",
    "This is a tough moment, not a tough life. Small steps are still steps forward."
  ];

  if (sentimentScore > 0.1) {
    return positiveTips[Math.floor(Math.random() * positiveTips.length)];
  } else if (sentimentScore < -0.1) {
    return negativeTips[Math.floor(Math.random() * negativeTips.length)];
  } else {
    return neutralTips[Math.floor(Math.random() * neutralTips.length)];
  }
};
