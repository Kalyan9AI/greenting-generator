"use client";

import { useMemo, useState } from "react";

type QuoteResponse = {
  quotes: string[];
  error?: string;
};

const PRESET_CATEGORIES = [
  "Happy Birthday",
  "Wedding",
  "Retirement",
  "Anniversary",
  "Congratulations",
  "Get Well Soon",
  "Thank You",
  "Farewell",
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    PRESET_CATEGORIES[0]
  );
  const [customOccasion, setCustomOccasion] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("sincere");
  const [stylePerson, setStylePerson] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<string[]>([]);

  const occasionEffective = useMemo(() => {
    return customOccasion.trim() || selectedCategory || "Greeting";
  }, [customOccasion, selectedCategory]);

  async function generateQuotes() {
    setLoading(true);
    setError(null);
    setQuotes([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory,
          customOccasion: customOccasion || undefined,
          recipient: recipient || undefined,
          tone: tone || undefined,
          stylePerson: stylePerson || undefined,
          language: language || undefined,
          count: 10,
        }),
      });
      const data: QuoteResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quotes");
      setQuotes(data.quotes || []);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message || "")
          : "";
      setError(message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyQuote(q: string) {
    navigator.clipboard.writeText(q);
  }

  function copyAll() {
    const text = quotes.map((q, i) => `${i + 1}. ${q}`).join("\n\n");
    navigator.clipboard.writeText(text);
  }

  function downloadTxt() {
    const blob = new Blob([quotes.map((q, i) => `${i + 1}. ${q}`).join("\n\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${occasionEffective.replace(/\s+/g, "-").toLowerCase()}-quotes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="font-sans min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Greeting Quotes Generator
        </h1>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">
          Generate 10 bespoke quotes for common occasions, or craft your own.
        </p>

        <div className="mt-8 grid gap-6">
          <section>
            <h2 className="text-lg font-medium mb-3">Select an occasion</h2>
            <div className="flex flex-wrap gap-2">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                    selectedCategory === cat
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm mb-1">Custom occasion (optional)</label>
              <input
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="e.g., Baby Shower, Housewarming, Promotion..."
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              />
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm mb-1">Recipient details</label>
              <textarea
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Name, relationship, traits, interests, key details..."
                rows={4}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
              />
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                >
                  <option value="sincere">Sincere</option>
                  <option value="funny">Funny</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="romantic">Romantic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Famous person style (optional)</label>
                <input
                  value={stylePerson}
                  onChange={(e) => setStylePerson(e.target.value)}
                  placeholder="e.g., Maya Angelou, Shakespeare, Dr. Seuss..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Language (optional)</label>
                <input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g., English, Español, Français, हिन्दी..."
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button
              onClick={generateQuotes}
              disabled={loading}
              className="rounded-md bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate 10 quotes"}
            </button>
            {quotes.length > 0 && (
              <>
                <button
                  onClick={copyAll}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Copy all
                </button>
                <button
                  onClick={downloadTxt}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Download .txt
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
          )}

          {quotes.length > 0 && (
            <section className="grid gap-3">
              <h2 className="text-lg font-medium">
                {occasionEffective} — {quotes.length} quotes
              </h2>
              <ul className="grid gap-3">
                {quotes.map((q, idx) => (
                  <li
                    key={idx}
                    className="rounded-lg border p-4 grid gap-2 bg-white/40 dark:bg-black/40"
                  >
                    <p className="text-sm leading-relaxed">{q}</p>
                    <div>
                      <button
                        onClick={() => copyQuote(q)}
                        className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        Copy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
