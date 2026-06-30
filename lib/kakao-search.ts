import "server-only";
import type { PlaceRaw } from "./types";

// 한 요청이 hang되면 /result 전체가 대기하므로 타임아웃으로 빠르게 실패시킨다.
const TIMEOUT_MS = 8000;

export async function searchKakao(
  query: string,
  categoryCode: string,
  size = 15,
): Promise<PlaceRaw[]> {
  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);
  url.searchParams.set("category_group_code", categoryCode);
  url.searchParams.set("size", String(size));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`카카오 검색 실패: ${res.status} ${body}`);
  }

  const data = await res.json();
  return data.documents.map((d: Record<string, string>) => ({
    id: d.id,
    name: d.place_name,
    category: d.category_name,
    address: d.road_address_name || d.address_name,
    x: d.x,
    y: d.y,
    url: d.place_url,
  }));
}
