export interface Region {
  /** URL·식별용 안정 키 (ASCII) */
  id: string;
  /** 표시 이름 */
  name: string;
  /** 자치구 */
  gu: string;
  /** 한 줄 분위기 설명 */
  description: string;
  /** 카카오 로컬 검색에 쓰는 키워드 */
  query: string;
  /** 기본 노출되는 인기 지역 여부 (나머지는 검색으로만 노출) */
  popular?: boolean;
}

// 지역 추가는 이 배열에 한 줄 추가하면 된다. UI(인기 칩·검색)와 엔진 검색어가 함께 반영.
export const REGIONS: Region[] = [
  { id: "seongsu", name: "성수", gu: "성동구", description: "감성 카페 거리", query: "성수동", popular: true },
  { id: "hongdae", name: "홍대", gu: "마포구", description: "활기찬 거리", query: "홍대", popular: true },
  { id: "hapjeong", name: "합정", gu: "마포구", description: "조용한 골목", query: "합정동", popular: true },
  { id: "gangnam", name: "강남", gu: "강남구", description: "세련된 도심", query: "강남", popular: true },
  { id: "itaewon", name: "이태원", gu: "용산구", description: "이국적인 분위기", query: "이태원", popular: true },
  { id: "seoulforest", name: "서울숲", gu: "성동구", description: "도심 속 공원", query: "서울숲", popular: true },
  { id: "seongbuk", name: "성북동", gu: "성북구", description: "조용한 언덕길", query: "성북동" },
  { id: "yeonnam", name: "연남동", gu: "마포구", description: "골목 카페 동네", query: "연남동" },
  { id: "samcheong", name: "삼청동", gu: "종로구", description: "고즈넉한 한옥길", query: "삼청동" },
];

export const POPULAR_REGIONS = REGIONS.filter((r) => r.popular);

export function getRegionById(id: string): Region | undefined {
  return REGIONS.find((r) => r.id === id);
}

/** 이름·구 부분일치로 지역을 필터한다. */
export function searchRegions(query: string): Region[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return REGIONS.filter(
    (r) => r.name.toLowerCase().includes(q) || r.gu.toLowerCase().includes(q),
  );
}
