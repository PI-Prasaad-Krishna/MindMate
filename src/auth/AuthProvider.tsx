// src/auth/AuthProvider.tsx
import {
  signInAnonymously,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";

/* ---------- Nickname helper (localStorage) ---------- */
function getOrCreateNickname() {
  let nick = localStorage.getItem("mindmate_nickname");
  if (nick) return nick;

  const animals = ["Tiger", "Falcon", "Koala", "Otter", "Panda"];
  const moods   = ["Calm", "Bright", "Brave", "Gentle", "Sunny"];
  nick =
    moods[Math.floor(Math.random() * moods.length)] +
    animals[Math.floor(Math.random() * animals.length)] +
    Math.floor(Math.random() * 100);
  localStorage.setItem("mindmate_nickname", nick);
  return nick;
}

/* ---------- React context ---------- */
type AuthCtx = { user: User | null; nickname: string };

const AuthContext = createContext<AuthCtx>({
  user: null,
  nickname: getOrCreateNickname(),
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const nickname = getOrCreateNickname();

  useEffect(() => {
    // Listen for auth; sign in anonymously if needed
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else signInAnonymously(auth).catch(console.error);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, nickname }}>
      {children}
    </AuthContext.Provider>
  );
}
