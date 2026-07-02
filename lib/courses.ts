import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Course } from "./types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// 저장: RLS를 우회하는 secret 키(서버 전용). 쓰기 정책이 없어 이 키로만 insert 가능.
function writeClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// 읽기: RLS 공개 읽기 정책을 따르는 publishable 키.
function readClient() {
  return createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}

export interface SavedCourse {
  regionId: string;
  moodIds: string[];
  course: Course;
}

/** 생성된 코스를 저장하고 공유용 id(uuid)를 돌려준다. */
export async function saveCourse(
  regionId: string,
  moodIds: string[],
  course: Course,
): Promise<string> {
  const { data, error } = await writeClient()
    .from("courses")
    .insert({ region_id: regionId, mood_ids: moodIds, course })
    .select("id")
    .single();

  if (error) throw new Error(`코스 저장 실패: ${error.message}`);
  return data.id as string;
}

/**
 * 저장된 코스를 id로 조회한다. 없으면 null.
 * 같은 요청에서 page·generateMetadata가 함께 호출하므로 cache로 중복 조회를 막는다.
 */
export const getCourseById = cache(
  async (id: string): Promise<SavedCourse | null> => {
    const { data, error } = await readClient()
      .from("courses")
      .select("region_id, mood_ids, course")
      .eq("id", id)
      .maybeSingle();

    if (error) throw new Error(`코스 조회 실패: ${error.message}`);
    if (!data) return null;

    return {
      regionId: data.region_id as string,
      moodIds: (data.mood_ids as string[]) ?? [],
      course: data.course as Course,
    };
  },
);
