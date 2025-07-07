
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, TrendingUp, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import MoodChart from '@/components/MoodChart';
import ChatRoom from '@/components/ChatRoom';
import { analyzeSentiment, getCopingTip } from '@/utils/sentimentAnalysis';
import { saveMoodEntry, getMoodHistory, generateNickname } from '@/utils/storage';

const Index = () => {
  const [checkInText, setCheckInText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<{score: number, tip: string} | null>(null);
  const [moodHistory, setMoodHistory] = useState<Array<{date: string, score: number}>>([]);
  const [userNickname, setUserNickname] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Initialize user nickname and load mood history
    const initializeUser = async () => {
      let nickname = localStorage.getItem('mindmate_nickname');
      if (!nickname) {
        nickname = generateNickname();
        localStorage.setItem('mindmate_nickname', nickname);
      }
      setUserNickname(nickname);
      
      const history = await getMoodHistory();
      setMoodHistory(history);
    };
    
    initializeUser();
  }, []);

  const handleCheckIn = async () => {
    if (!checkInText.trim()) {
      toast({
        title: "Please share your thoughts",
        description: "Enter a message to check in with your mental health today.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const sentimentScore = analyzeSentiment(checkInText);
      const copingTip = getCopingTip(sentimentScore);
      
      const analysis = { score: sentimentScore, tip: copingTip };
      setLastAnalysis(analysis);
      
      // Save mood entry
      await saveMoodEntry(sentimentScore);
      
      // Refresh mood history
      const updatedHistory = await getMoodHistory();
      setMoodHistory(updatedHistory);
      
      toast({
        title: "Check-in recorded! 💙",
        description: "Your mood has been tracked. Remember, it's okay to have difficult days.",
      });
      
      setCheckInText('');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Unable to analyze your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.1) return 'text-green-600';
    if (score < -0.1) return 'text-red-500';
    return 'text-yellow-600';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.1) return 'Positive';
    if (score < -0.1) return 'Negative';
    return 'Neutral';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-teal-600 mr-2" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              MindMate
            </h1>
          </div>
          <p className="text-lg text-gray-600">Your anonymous mental health companion</p>
          {userNickname && (
            <p className="text-sm text-gray-500 mt-2">Welcome back, {userNickname}</p>
          )}
        </div>

        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Check-In
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Support Room
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mood Tracker
            </TabsTrigger>
          </TabsList>

          {/* Daily Check-In Tab */}
          <TabsContent value="checkin" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <Heart className="h-5 w-5" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, feelings, or what's on your mind today..."
                  value={checkInText}
                  onChange={(e) => setCheckInText(e.target.value)}
                  className="min-h-32 resize-none border-teal-200 focus:border-teal-400"
                />
                <Button 
                  onClick={handleCheckIn}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
                >
                  {isAnalyzing ? (
                    <>Analyzing your mood...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Result */}
            {lastAnalysis && (
              <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Your Mood Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sentiment:</span>
                    <span className={`font-semibold ${getSentimentColor(lastAnalysis.score)}`}>
                      {getSentimentLabel(lastAnalysis.score)} ({lastAnalysis.score.toFixed(2)})
                    </span>
                  </div>
                  <div className="p-4 bg-white/80 rounded-lg">
                    <h4 className="font-medium text-teal-700 mb-2">💡 Coping Tip:</h4>
                    <p className="text-gray-700">{lastAnalysis.tip}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat Room Tab */}
          <TabsContent value="chat">
            <ChatRoom userNickname={userNickname} />
          </TabsContent>

          {/* Mood Tracker Tab */}
          <TabsContent value="mood">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <TrendingUp className="h-5 w-5" />
                  Your Mood Journey (Past 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MoodChart data={moodHistory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
