export interface Mood {
  /** URL·엔진 전달용 안정 키 (ASCII) */
  id: string;
  /** 표시 라벨 */
  label: string;
}

export const MOODS: Mood[] = [
  { id: "emotional", label: "감성적인" },
  { id: "lively", label: "활기찬" },
  { id: "quiet", label: "조용한" },
  { id: "special", label: "특별한" },
  { id: "nature", label: "자연친화적" },
];

export function getMoodById(id: string): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}
