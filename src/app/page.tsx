"use client";
import React, { useState } from "react";
import { Geist } from "next/font/google";

const ABSURDITY_LEVELS = ["Low", "Medium", "High"];

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

function sanitize(input: string, maxLen = 64) {
  return input.replace(/[^\w\s\-.,'!]/g, '').trim().slice(0, maxLen);
}

export default function Home() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [absurdity, setAbsurdity] = useState("Medium");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showAllFavorites, setShowAllFavorites] = useState(false);

  // Load favorites from localStorage on client only
  React.useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(stored);
    } catch {
      // ignore
    }
  }, []);

  // Save favorites to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setAchievements([]);
    setLoading(true);
    // Client-side sanitize
    const safeName = sanitize(name, 32);
    const safeCategory = sanitize(category, 32);
    if (!safeName || !safeCategory) {
      setError("Please enter both name and category.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: safeName,
          category: safeCategory,
          number: 1, // Always generate one achievement
          absurdity,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");
      setAchievements(data.achievements || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate achievements.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (idx: number) => {
    if (achievements[idx]) {
      await navigator.clipboard.writeText(achievements[idx]);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    }
  };

  const handleFavorite = (achievement: string) => {
    if (!favorites.includes(achievement)) {
      setFavorites([...favorites, achievement]);
    }
  };

  const handleDeleteFavorite = (achievement: string) => {
    setFavorites(favorites.filter(fav => fav !== achievement));
  };

  return (
    <div className={"min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-900 relative overflow-x-hidden " + geist.variable}>
      {/* Decorative blurred shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl z-0" />
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[90vh] p-4 sm:p-8">
        <section className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 flex flex-col items-center gap-10 max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center mb-2 drop-shadow-xl">Fake Achievement Generator</h1>
          <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-300 text-center max-w-2xl mb-6">Create hilarious, absurd, and creative achievements for any name and category. Powered by Google Gemini AI.</p>
          <form
            className="w-full flex flex-col gap-6 items-center"
            onSubmit={handleGenerate}
          >
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <input
                className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Name (e.g. Alex)"
                value={name}
                maxLength={32}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className="flex-1 rounded-full border border-gray-300 dark:border-gray-700 px-5 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                placeholder="Category (e.g. gaming, coding)"
                value={category}
                maxLength={32}
                onChange={e => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <label className="text-gray-700 dark:text-gray-200 font-medium">Absurdity:</label>
                <select
                  value={absurdity}
                  onChange={e => setAbsurdity(e.target.value)}
                  className="rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800 dark:text-white shadow-sm transition-all"
                >
                  {ABSURDITY_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full flex gap-4 mt-2 justify-center">
              <button
                type="button"
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-400 hover:from-green-600 hover:to-blue-500 text-white font-bold py-3 rounded-full shadow-xl transition-all duration-200 text-lg flex items-center justify-center gap-2 max-w-xs"
                onClick={handleGenerate}
                disabled={loading}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 6l6 6-6 6" /></svg>
                {loading ? "Generating..." : "Regenerate"}
              </button>
            </div>
            {error && <div className="text-red-600 text-center mt-2 font-semibold">{error}</div>}
          </form>

          {achievements.length > 0 && (
            <section className="w-full flex flex-col gap-8 mb-8 max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Achievements</h2>
                <button
                  className="text-blue-600 hover:underline text-base font-medium"
                  onClick={handleGenerate}
                  disabled={loading}
                >
                  Generate again
                </button>
              </div>
              <div className="grid gap-8 sm:grid-cols-1">
                {achievements.map((ach, idx) => {
                  // Split at the first em dash (—)
                  const dashIdx = ach.indexOf('—');
                  let left = ach, right = '';
                  if (dashIdx !== -1) {
                    left = ach.slice(0, dashIdx).trim();
                    right = ach.slice(dashIdx + 1).trim();
                  }
                  return (
                    <div
                      key={idx}
                      className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-7 flex flex-col gap-5 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 group overflow-hidden max-w-xl mx-auto"
                    >
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-400 to-pink-400 dark:from-blue-700 dark:to-pink-700 rounded-l-2xl" />
                      <div className="flex items-center gap-4">
                        <span role="img" aria-label="trophy" className="text-4xl animate-pulse drop-shadow-lg">🏆</span>
                        <div className="flex-1 text-gray-900 dark:text-gray-100">
                          <strong className="font-extrabold text-xl sm:text-2xl leading-tight group-hover:text-blue-700 dark:group-hover:text-pink-300 transition-colors">{left}</strong>
                          {right && <span className="ml-2 text-lg sm:text-xl text-gray-700 dark:text-gray-200">— {right}</span>}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500 text-white px-4 py-2 rounded-full shadow-md font-semibold transition-all duration-150"
                          onClick={() => handleCopy(idx)}
                        >
                          {copiedIdx === idx ? "Copied!" : "Copy"}
                        </button>
                        <button
                          className="text-xs sm:text-sm bg-gradient-to-r from-pink-500 to-blue-400 hover:from-pink-600 hover:to-blue-500 text-white px-4 py-2 rounded-full shadow-md font-semibold transition-all duration-150"
                          onClick={() => handleFavorite(ach)}
                          disabled={favorites.includes(ach)}
                        >
                          {favorites.includes(ach) ? "Favorited" : "Favorite"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {favorites.length > 0 && (
            <section className="w-full mb-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Saved Achievements</h2>
              <div className="grid gap-4 sm:grid-cols-1">
                {favorites.slice(0, 3).map((fav, idx) => {
                  // Split at the first em dash (—)
                  const dashIdx = fav.indexOf('—');
                  let left = fav, right = '';
                  if (dashIdx !== -1) {
                    left = fav.slice(0, dashIdx).trim();
                    right = fav.slice(dashIdx + 1).trim();
                  }
                  return (
                    <div key={idx} className="flex items-center bg-pink-100/90 dark:bg-pink-900/80 rounded-2xl px-5 py-4 text-pink-900 dark:text-pink-100 shadow-md gap-4">
                      <span role="img" aria-label="star" className="text-2xl">🏆</span>
                      <div className="flex-1 min-w-0">
                        <strong className="block font-bold truncate text-base sm:text-lg">{left}</strong>
                        {right && <span className="block text-pink-800 dark:text-pink-200 text-sm truncate">— {right}</span>}
                      </div>
                      <button
                        className="ml-2 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title="Copy"
                        onClick={async () => {
                          await navigator.clipboard.writeText(fav);
                          setCopiedIdx(idx + 1000); // offset to avoid clash with main list
                          setTimeout(() => setCopiedIdx(null), 1200);
                        }}
                      >
                        {copiedIdx === idx + 1000 ? (
                          <span className="text-xs font-semibold">Copied!</span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                        )}
                      </button>
                      <button
                        className="ml-2 text-pink-700 dark:text-pink-200 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                        title="Delete"
                        onClick={() => handleDeleteFavorite(fav)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
              {favorites.length > 3 && (
                <button
                  className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-pink-400 text-white font-semibold shadow hover:from-blue-600 hover:to-pink-500 transition-all"
                  onClick={() => setShowAllFavorites(true)}
                >
                  Show All
                </button>
              )}
            </section>
          )}

          {/* Modal for all favorites */}
          {showAllFavorites && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-xl w-full max-h-[80vh] p-8 overflow-y-auto flex flex-col gap-6">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold focus:outline-none"
                  onClick={() => setShowAllFavorites(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">All Saved Achievements</h2>
                <div className="flex flex-col gap-4">
                  {favorites.map((fav, idx) => {
                    // Split at the first em dash (—)
                    const dashIdx = fav.indexOf('—');
                    let left = fav, right = '';
                    if (dashIdx !== -1) {
                      left = fav.slice(0, dashIdx).trim();
                      right = fav.slice(dashIdx + 1).trim();
                    }
                    return (
                      <div key={idx} className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-3 group">
                        <div className="flex items-center gap-3">
                          <span role="img" aria-label="trophy" className="text-2xl">🏆</span>
                          <div className="flex-1 min-w-0">
                            <strong className="block font-bold text-base sm:text-lg truncate">{left}</strong>
                            {right && <span className="block text-gray-700 dark:text-gray-200 text-sm truncate">— {right}</span>}
                          </div>
                          <button
                            className="ml-2 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-blue-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title="Copy"
                            onClick={async () => {
                              await navigator.clipboard.writeText(fav);
                              setCopiedIdx(idx + 2000); // offset to avoid clash
                              setTimeout(() => setCopiedIdx(null), 1200);
                            }}
                          >
                            {copiedIdx === idx + 2000 ? (
                              <span className="text-xs font-semibold">Copied!</span>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><rect x="3" y="3" width="13" height="13" rx="2" /></svg>
                            )}
                          </button>
                          <button
                            className="ml-2 text-pink-700 dark:text-pink-200 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Delete"
                            onClick={() => handleDeleteFavorite(fav)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <footer className="mt-auto text-center text-gray-500 dark:text-gray-400 text-xs py-6 w-full flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <a href="/about" className="underline hover:text-blue-600 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">About</a>
              <a href="#contact" className="underline hover:text-blue-600 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Contact</a>
            </div>
            <div id="contact" className="mt-2">Contact: <span className="font-mono">fake-achievements@example.com</span> (dummy)</div>
          </footer>
        </section>
      </main>
    </div>
  );
}
