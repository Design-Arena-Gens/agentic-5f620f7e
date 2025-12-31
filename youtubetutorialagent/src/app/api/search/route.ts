import { NextRequest, NextResponse } from "next/server";
import { GetListByKeyword, type VideoItem } from "youtube-search-api";

interface VideoResult {
  id: string;
  title: string;
  channelTitle: string;
  channelId: string | null;
  channelUrl: string | null;
  thumbnail: string | null;
  durationLabel: string | null;
  durationSeconds: number | null;
  isLive: boolean;
}

const MAX_RESULTS = 30;

const appendEditingKeywords = (query: string) => {
  const normalized = query.toLowerCase();
  if (normalized.includes("edit") || normalized.includes("tutorial")) {
    return query;
  }
  return `${query} editing tutorial`;
};

const parseDurationLabel = (label: string | null): number | null => {
  if (!label) {
    return null;
  }
  const parts = label.split(":").map((part) => parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) {
    return null;
  }
  return parts.reduce((acc, current) => acc * 60 + current, 0);
};

const mapItemToVideo = (item: VideoItem | undefined): VideoResult | null => {
  if (!item || item.type !== "video" || !item.id) {
    return null;
  }

  const runs = item.shortBylineText?.runs ?? [];
  const primaryRun = runs[0];
  const channelId =
    primaryRun?.navigationEndpoint?.browseEndpoint?.browseId ?? null;
  const channelUrl =
    primaryRun?.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ??
    null;

  const thumbnails = item.thumbnail?.thumbnails ?? [];
  const thumbnail = thumbnails[thumbnails.length - 1]?.url ?? null;

  const durationLabel = item.length?.simpleText ?? null;
  const durationSeconds = parseDurationLabel(durationLabel);

  return {
    id: item.id,
    title: item.title ?? "Untitled",
    channelTitle: item.channelTitle ?? "Unknown creator",
    channelId,
    channelUrl,
    thumbnail,
    durationLabel,
    durationSeconds,
    isLive: Boolean(item.isLive),
  };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json(
      { error: "Missing search query" },
      { status: 400 }
    );
  }

  const type = searchParams.get("type") === "shorts" ? "shorts" : "tutorials";

  try {
    const searchQuery =
      type === "shorts" ? `${query} vertical video` : appendEditingKeywords(query);
    const response = await GetListByKeyword(
      searchQuery,
      false,
      MAX_RESULTS,
      [{ type: "video" }]
    );

    const mapped = (response.items ?? [])
      .map(mapItemToVideo)
      .filter((video): video is VideoResult => Boolean(video));

    const filtered =
      type === "shorts"
        ? mapped.filter((video) => {
            if (video.isLive) return false;
            if (video.durationSeconds == null) return false;
            return video.durationSeconds <= 90;
          })
        : mapped.filter((video) => !video.isLive);

    return NextResponse.json({
      query,
      type,
      total: filtered.length,
      results: filtered,
    });
  } catch (error) {
    console.error("YouTube search error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
