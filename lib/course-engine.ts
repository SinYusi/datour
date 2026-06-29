import { readFile } from "node:fs/promises";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import { searchKakao } from "./kakao-search";
import type { Region } from "./regions";
import type { Course, PlaceRaw, Stop } from "./types";

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

  let course = await callGemini();

  // 검증: place_id가 후보 목록에 실제로 존재하는지 확인, 실패 시 1회 재시도
  const isValid = (c: Course) => c.stops.every((s) => placeById[s.place_id]);

  if (!isValid(course)) {
    course = await callGemini();
  }

  // 좌표 + 주소 + URL 붙이기 (LLM 출력 대신 카카오 원본 데이터 사용)
  const stops: Stop[] = course.stops.map((s) => {
    const place = placeById[s.place_id];
    return {
      ...s,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x),
      address: place.address,
      url: place.url,
    };
  });

  return { ...course, stops };
}
