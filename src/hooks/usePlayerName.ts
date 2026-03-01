"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "billionaire-smash-player-name";

export function usePlayerName() {
  const [name, setName] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setName(stored);
    setLoaded(true);
  }, []);

  const saveName = useCallback((newName: string) => {
    const trimmed = newName.trim().slice(0, 30);
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
      setName(trimmed);
    }
  }, []);

  return { name, loaded, saveName };
}
