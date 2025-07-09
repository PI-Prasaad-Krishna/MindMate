/* ------------------------------------------------------------------
   ChatRoom.tsx  –  Realtime anonymous support room
   ------------------------------------------------------------------ */

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/auth/AuthProvider";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Users } from "lucide-react";

type ChatMsg = {
  id?: string;
  nickname: string;
  message: string;
  createdAt?: { seconds: number };
};

export default function ChatRoom() {
  const { nickname } = useAuth();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  /* 🔄 realtime listener */
  useEffect(() => {
    const q = query(collection(db, "chatMessages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...(d.data() as ChatMsg) })));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 20);
    });
    return unsub;
  }, []);

  /* ➡️ send msg */
  const sendMessage = async () => {
    if (!input.trim()) return;
    await addDoc(collection(db, "chatMessages"), {
      nickname,
      message: input.trim().slice(0, 500),
      createdAt: serverTimestamp(),
    });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (m: ChatMsg) =>
    m.createdAt
      ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const isMine = (m: ChatMsg) => m.nickname === nickname;

  /* ----------------------------------------------------------------
     render
     ---------------------------------------------------------------- */
  return (
    <Card className="h-96 flex flex-col bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-teal-700">
          <MessageCircle className="h-5 w-5" />
          Support Room
          <span className="ml-auto flex items-center gap-1 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            Anonymous
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-3 overflow-hidden">
        {/* ── messages list ───────────────────────────────────────── */}
        <div className="flex-1 min-h-0 overflow-y-auto space-y-2 p-2 bg-gray-50/60 rounded">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No messages yet. Break the ice!</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${isMine(m) ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] break-words px-3 py-2 rounded-lg ${
                    isMine(m)
                      ? "bg-teal-500 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span
                      className={`font-medium ${
                        isMine(m) ? "text-teal-100" : "text-teal-600"
                      }`}
                    >
                      {m.nickname}
                    </span>
                    <span className={isMine(m) ? "text-teal-200" : "text-gray-400"}>
                      {formatTime(m)}
                    </span>
                  </div>
                  {m.message}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        {/* ─────────────────────────────────────────────────────────── */}

        {/* input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share something supportive…"
            className="flex-1"
          />
          <Button
            disabled={!input.trim()}
            onClick={sendMessage}
            className="bg-teal-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Be kind. Messages are public &amp; anonymous.
        </p>
      </CardContent>
    </Card>
  );
}
