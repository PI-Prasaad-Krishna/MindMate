import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { subDays, format } from "date-fns";

import { db } from "@/lib/firebase";
import { useAuth } from "@/auth/AuthProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type MoodDoc = { score: number; ts: Timestamp };
type ChartPoint = { date: string; score: number };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ChartPoint[]>([]);

  /* 🔄 live query for last 7 days */
  useEffect(() => {
    if (!user) return;

    const sevenDaysAgo = subDays(new Date(), 6); // today + 6 previous
    const q = query(
      collection(db, "users", user.uid, "moods"),
      where("ts", ">=", sevenDaysAgo),
      orderBy("ts", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const points: ChartPoint[] = snap.docs.map((d) => {
        const { score, ts } = d.data() as MoodDoc;
        return {
          date: format(ts.toDate(), "EEE"), // Mon, Tue, …
          score,
        };
      });
      setData(points);
    });

    return unsub;
  }, [user]);

  return (
    <Card className="max-w-xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Your Mood – Last 7 Days</CardTitle>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No mood entries yet. Add one on the Check‑In page!
          </p>
        ) : (
          <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[-1, 1]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#14b8a6" dot />
          </LineChart>
        )}
      </CardContent>
    </Card>
  );
}
