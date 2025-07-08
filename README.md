
# MindMate - Anonymous Mental Health Support App

MindMate is a compassionate web application that provides anonymous mental health support through daily check-ins, sentiment analysis, peer chat, and mood tracking.

## 🌟 Features

- **Daily Mental Health Check-ins**: Share your thoughts and receive personalized coping tips
- **Sentiment Analysis**: AI-powered mood analysis using VADER sentiment analysis
- **Anonymous Support Chat**: Connect with others in a safe, anonymous environment  
- **Mood Tracking**: Visualize your emotional journey over the past 7 days
- **Privacy-First**: No registration required, completely anonymous

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd mindmate

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:8080` to see the app.

## 🏗️ Architecture

### Current MVP (Local Storage)
- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts for mood visualization
- **Storage**: LocalStorage (for MVP demo)
- **Sentiment**: Custom VADER-like algorithm

### Production Roadmap
- **Auth**: Firebase Anonymous Authentication
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **API**: Python Flask with VADER sentiment analysis

## 📊 Data Structure

### Mood Entries
```typescript
{
  date: "2025-07-07",
  score: -0.6,        // Sentiment score between -1 and 1
  timestamp: 1704636000000
}
```

### Chat Messages
```typescript
{
  id: "unique-id",
  nickname: "CalmTiger42",
  message: "Having a tough day but staying strong",
  timestamp: Date
}
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Components
- `src/pages/Index.tsx` - Main app with tabbed interface
- `src/components/MoodChart.tsx` - Mood visualization component
- `src/components/ChatRoom.tsx` - Real-time chat interface
- `src/utils/sentimentAnalysis.ts` - Sentiment analysis logic
- `src/utils/storage.ts` - Data persistence utilities

## 🚀 Deployment

### Firebase Hosting (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize project: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Alternative Platforms
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder after `npm run build`

## 🔒 Privacy & Security

- No user registration or personal data collection
- Anonymous nicknames generated randomly
- All data stored locally (MVP) or anonymously (production)
- No tracking or analytics that compromise privacy

## 📱 Responsive Design

- Mobile-first approach
- Optimized for phones, tablets, and desktop
- Touch-friendly interface elements
- Accessible color contrasts and typography

## 🤝 Contributing

This is an MVP built for demonstration. For production use:

1. Implement Firebase Authentication & Firestore
2. Add proper sentiment analysis API
3. Implement content moderation for chat
4. Add user reporting systems
5. Enhanced accessibility features

## 📄 License

MIT License - feel free to use this code for educational or personal projects.

## 🆘 Support

If you're struggling with mental health:
- In the US: National Suicide Prevention Lifeline: 988
- In the UK: Samaritans: 116 123
- International: befrienders.org

Remember: This app is not a replacement for professional mental health care.
