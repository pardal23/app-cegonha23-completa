
export interface StoredFile {
  id: number;
  name: string;
  type: string;
  size: number;
  data: ArrayBuffer;
  textContent: string | null;
  created: string;
}

export type PreviewTarget =
  | { type: 'media'; file: StoredFile }
  | { type: 'youtube'; videoId: string }
  | null;
