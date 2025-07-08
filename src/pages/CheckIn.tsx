import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { analyse } from "@/utils/sentimentAnalysis";
import { db } from "@/lib/firebase";
import { useAuth } from "@/auth/AuthProvider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Check } from "lucide-react";

export default function CheckIn() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [tip, setTip] = useState<string | null>(null);

  const submit = async () => {
    if (!text.trim() || !user) return;
    const { score, tip } = analyse(text.trim());
    setTip(tip);

    await addDoc(
      collection(db, "users", user.uid, "moods"),
      { score, ts: serverTimestamp() }
    );

    setText("");
  };

  return (
    <Card className="max-w-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle>Daily Check‑In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a sentence about how you feel…"
          rows={4}
        />
        <Button disabled={!text.trim()} onClick={submit} className="w-full">
          <Check className="h-4 w-4 mr-1" /> Save Mood
        </Button>

        {tip && (
          <p className="text-center text-sm text-teal-600 font-medium mt-2">
            💡 {tip}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
