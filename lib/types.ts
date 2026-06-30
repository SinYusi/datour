export interface PlaceRaw {
  id: string;
  name: string;
  category: string;
  address: string;
  x: string; // 경도 (longitude)
  y: string; // 위도 (latitude)
  url: string;
}

export interface Stop {
  order: number;
  type: "식사" | "카페" | "액티비티";
  place_id: string;
  place_name: string;
  reason: string;
  lat: number;
  lng: number;
  address: string;
  url: string;
}

export interface Course {
  course_title: string;
  summary: string;
  stops: Stop[];
}
