"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type VideoResult = {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string | null;
  channelUrl: string | null;
  thumbnail: string | null;
  durationLabel: string | null;
  durationSeconds: number | null;
  isLive: boolean;
};

type SearchMode = "tutorials" | "shorts";

const DEFAULT_QUERY = "capcut editing tutorial hindi";

const QUICK_PROMPTS = [
  "premiere pro cinematic edit",
  "mobile vlog editing tutorial",
  "kinemaster gaming montage",
  "capcut trending reels idea",
  "after effects motion graphics basic",
  "vn app smooth transitions hindi",
];

export default function Home() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [mode, setMode] = useState<SearchMode>("tutorials");
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearched, setLastSearched] = useState(DEFAULT_QUERY);

  const headline = useMemo(
    () =>
      mode === "tutorials"
        ? "Long-form editing lessons curated for your channel"
        : "Short-form hacks to speed up your editing workflow",
    [mode]
  );

  const fetchResults = useCallback(
    async (term: string, selectedMode: SearchMode) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}&type=${
            selectedMode === "shorts" ? "shorts" : "tutorials"
          }`
        );

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Unable to load results.");
        }

        const payload = await response.json();
        setVideos(payload.results ?? []);
        setLastSearched(term);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected error occurred.";
        setError(message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!query.trim()) return;
      fetchResults(query.trim(), mode);
    },
    [fetchResults, mode, query]
  );

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      setQuery(prompt);
      fetchResults(prompt, mode);
    },
    [fetchResults, mode]
  );

  const handleModeChange = useCallback(
    (nextMode: SearchMode) => {
      if (mode === nextMode) return;
      setMode(nextMode);
      const term = query.trim() || DEFAULT_QUERY;
      fetchResults(term, nextMode);
    },
    [fetchResults, mode, query]
  );

  useEffect(() => {
    fetchResults(DEFAULT_QUERY, "tutorials");
  }, [fetchResults]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:gap-8 lg:px-10">
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
              YouTube Editing Agent
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              आपके YouTube कंटेंट के लिए ताज़ा Editing Tutorials & Shorts
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              स्मार्ट एजेंट जो आपके टॉपिक के लिए भरोसेमंद वीडियो एडिटिंग ट्यूटोरियल
              और शॉर्ट टिप्स ढूंढता है। मोबाइल से लेकर प्रोफेशनल सॉफ़्टवेयर तक सभी
              के लिए प्रेरणा, टेम्पलेट्स और वर्कफ़्लो एक ही जगह।
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:gap-4"
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="जैसे: CapCut slow motion transition"
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loading ? "खोज जारी..." : "Search"}
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:border-emerald-300/70 hover:text-emerald-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-emerald-200/80">
                Agent Insight
              </p>
              <h2 className="text-2xl font-semibold text-white">{headline}</h2>
            </div>
            <div className="flex gap-2 rounded-full bg-white/5 p-1">
              <button
                onClick={() => handleModeChange("tutorials")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  mode === "tutorials"
                    ? "bg-emerald-400 text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Tutorials
              </button>
              <button
                onClick={() => handleModeChange("shorts")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  mode === "shorts"
                    ? "bg-emerald-400 text-slate-950 shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Shorts
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-300">
            Latest results for{" "}
            <span className="font-semibold text-white">
              “{lastSearched}”
            </span>{" "}
            — curated in real-time from YouTube. Save time by focusing on what
            really improves your edits.
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5"
              />
            ))}

          {!loading && videos.length === 0 && !error && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <p className="text-lg font-semibold text-white">
                कोई परिणाम नहीं मिला
              </p>
              <p className="max-w-md text-sm text-slate-300">
                अलग कीवर्ड ट्राई करें, जैसे “reels transition tricks” या
                “kinemaster chroma key tutorial”.
              </p>
            </div>
          )}

          {!loading &&
            videos.map((video) => (
              <article
                key={video.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:border-emerald-400/60 hover:bg-white/10"
              >
                <Link
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block"
                >
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      width={640}
                      height={360}
                      className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-slate-800 text-sm text-slate-300">
                      Preview unavailable
                    </div>
                  )}
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    {video.isLive && (
                      <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold uppercase text-white">
                        Live
                      </span>
                    )}
                    {video.durationLabel && !video.isLive && (
                      <span className="rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase text-white">
                        {video.durationLabel}
                      </span>
                    )}
                    {mode === "shorts" && !video.isLive && (
                      <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-[10px] font-semibold uppercase text-slate-950">
                        Short
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                  <Link
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-white transition hover:text-emerald-300"
                  >
                    {video.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold uppercase text-emerald-200">
                        {video.channelTitle
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div className="flex flex-col">
                        <Link
                          href={
                            video.channelUrl
                              ? `https://www.youtube.com${video.channelUrl}`
                              : video.channelId
                              ? `https://www.youtube.com/channel/${video.channelId}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-white transition hover:text-emerald-200"
                        >
                          {video.channelTitle}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {mode === "shorts"
                            ? "Shoot | Cut | Publish"
                            : "Deep dive tutorial"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {video.durationSeconds
                        ? `${Math.max(1, Math.round(video.durationSeconds / 60))} min watch`
                        : video.isLive
                        ? "Live Session"
                        : "Flexible length"}
                    </span>
                    <span>Powered by YouTube</span>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>
            Agent curated editing tutorials for creators • Powered by Next.js +
            YouTube data.
          </p>
          <p>
            Tip: Add आपके niche का नाम (wedding, travel, gaming) for sharper
            results.
          </p>
        </div>
      </footer>
    </div>
  );
}
