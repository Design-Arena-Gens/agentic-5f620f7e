declare module "youtube-search-api" {
  interface ThumbnailItem {
    url: string;
    width?: number;
    height?: number;
  }

  interface ThumbnailSet {
    thumbnails: ThumbnailItem[];
  }

  interface TextRun {
    text: string;
    navigationEndpoint?: {
      browseEndpoint?: {
        browseId?: string;
        canonicalBaseUrl?: string;
      };
      commandMetadata?: {
        webCommandMetadata?: {
          url?: string;
        };
      };
    };
  }

  interface ShortBylineText {
    runs?: TextRun[];
  }

  interface LengthInfo {
    simpleText?: string;
    accessibility?: {
      accessibilityData?: {
        label?: string;
      };
    };
  }

export interface VideoItem {
  id?: string;
  type?: string;
  title?: string;
  thumbnail?: ThumbnailSet;
  channelTitle?: string;
  shortBylineText?: ShortBylineText;
  length?: LengthInfo;
  isLive?: boolean;
}

export interface SearchResponse {
  items: VideoItem[];
  nextPage?: unknown;
}

export interface ShortVideo {
  id?: string;
  type?: string;
  thumbnail?: {
    url?: string;
    width?: number;
    height?: number;
  };
  title?: string;
}

const GetListByKeyword: (
  keyword: string,
  playlist?: boolean,
  limit?: number,
  options?: Array<{ type: string }>
) => Promise<SearchResponse>;

const GetSuggestData: (limit?: number) => Promise<{ items: { title: string }[] }>;

const GetShortVideo: () => Promise<ShortVideo[]>;

export { GetListByKeyword, GetSuggestData, GetShortVideo };
}
