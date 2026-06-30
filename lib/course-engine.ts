import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { searchKakao } from "./kakao-search";
import type { Region } from "./regions";
import type { Course, PlaceRaw, Stop } from "./types";

const EXPECTED_TYPES: Stop["type"][] = ["식사", "카페", "액티비티"];

export async function generateCourse(
  region: Region,
  moodLabels: string[],
): Promise<Course> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemPrompt = await readFile(
    path.join(process.cwd(), "prompts/course-system.md"),
    "utf-8",
  );

  const [식사Raw, 카페Raw, 액티비티Raw] = await Promise.all([
    searchKakao(region.query, "FD6"),
    searchKakao(region.query, "CE7"),
    searchKakao(region.query, "AT4"),
  ]);

  const placeById = Object.fromEntries(
    [...식사Raw, ...카페Raw, ...액티비티Raw].map((p) => [p.id, p]),
  );

  const toLite = (arr: PlaceRaw[]) =>
    arr.map(({ id, name, category, address }) => ({
      id,
      name,
      category,
      address,
    }));

  const userMessage = `
[사용자 조건]
- 지역: ${region.name}
- 분위기: ${moodLabels.join(", ")}

[식사 후보]
${JSON.stringify(toLite(식사Raw))}

[카페 후보]
${JSON.stringify(toLite(카페Raw))}

[액티비티 후보]
${JSON.stringify(toLite(액티비티Raw))}
`;

  const callGemini = async (): Promise<Course> => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt + "\n\n" + userMessage,
    });
    const raw = (response.text ?? "").replace(/```json|```/g, "").trim();
    return JSON.parse(raw);
  };

  // 코스 계약: 정확히 3곳, 각 place_id가 후보에 존재, 중복 없음, 식사/카페/액티비티 하나씩.
  const isValid = (c: Course) => {
    if (!c?.stops || c.stops.length !== EXPECTED_TYPES.length) return false;
    const ids = new Set<string>();
    for (const s of c.stops) {
      if (!placeById[s.place_id] || ids.has(s.place_id)) return false;
      ids.add(s.place_id);
    }
    return EXPECTED_TYPES.every((t) => c.stops.some((s) => s.type === t));
  };

  let course = await callGemini();
  if (!isValid(course)) {
    course = await callGemini(); // 1회 재시도
  }
  if (!isValid(course)) {
    throw new Error(
      "코스 생성 결과가 계약(정확히 3곳·유효 place_id·식사/카페/액티비티 각 1곳)을 충족하지 못했습니다.",
    );
  }

  // 식사 → 카페 → 액티비티 순으로 정렬하고, 이름·좌표·주소·URL을 카카오 원본으로 조인.
  // (LLM의 place_name은 신뢰하지 않고 place_id로 조인한 카카오 데이터로 덮어쓴다.)
  const stops: Stop[] = EXPECTED_TYPES.map((type, i) => {
    const s = course.stops.find((st) => st.type === type)!;
    const place = placeById[s.place_id];
    return {
      ...s,
      order: i + 1,
      place_name: place.name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      address: place.address,
      url: place.url,
    };
  });

  return { ...course, stops };
}
