export interface Budget {
  /** URL·식별용 안정 키 (ASCII) */
  id: string;
  /** 표시 라벨 */
  label: string;
  /** 한 줄 설명 (대략 금액) */
  description: string;
}

export const BUDGETS: Budget[] = [
  { id: "light", label: "가볍게", description: "부담 없이 · ~2만원" },
  { id: "moderate", label: "적당히", description: "무난하게 · 3~5만원" },
  { id: "special", label: "특별하게", description: "제대로 · 5만원+" },
];

export function getBudgetById(id: string): Budget | undefined {
  return BUDGETS.find((b) => b.id === id);
}
