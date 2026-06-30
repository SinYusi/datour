"use client";

import { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  Polyline,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import type { Stop } from "@/lib/types";

interface CourseMapProps {
  stops: Stop[];
  activeId?: string | null;
  onSelect?: (placeId: string) => void;
}

function MapFallback({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`flex h-[220px] w-full items-center justify-center rounded-2xl bg-muted text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
    >
      {children}
    </div>
  );
}

export function CourseMap({ stops, activeId, onSelect }: CourseMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_JS_KEY!,
  });
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  // 선택된 스톱이 바뀌면 그 마커로 부드럽게 이동.
  useEffect(() => {
    if (!map || !activeId) return;
    const stop = stops.find((s) => s.place_id === activeId);
    if (stop) map.panTo(new kakao.maps.LatLng(stop.lat, stop.lng));
  }, [map, activeId, stops]);

  if (loading) return <MapFallback>지도 불러오는 중…</MapFallback>;
  if (error) return <MapFallback error>지도를 불러오지 못했어요.</MapFallback>;

  // 지도 중심: 세 장소의 평균 좌표
  const center = {
    lat: stops.reduce((sum, s) => sum + s.lat, 0) / stops.length,
    lng: stops.reduce((sum, s) => sum + s.lng, 0) / stops.length,
  };
  const path = stops.map((s) => ({ lat: s.lat, lng: s.lng }));

  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <Map
        center={center}
        level={5}
        style={{ width: "100%", height: "220px" }}
        onCreate={setMap}
      >
        <Polyline
          path={path}
          strokeWeight={3}
          strokeColor="#1F7A6D"
          strokeOpacity={0.9}
          strokeStyle="solid"
        />
        {stops.map((stop, i) => (
          <CustomOverlayMap
            key={stop.place_id}
            position={{ lat: stop.lat, lng: stop.lng }}
            xAnchor={0.5}
            yAnchor={0.5}
            zIndex={activeId === stop.place_id ? 10 : 1}
          >
            <button
              type="button"
              onClick={() => onSelect?.(stop.place_id)}
              aria-label={`${stop.order}번째 ${stop.place_name}`}
              className={`flex size-6 items-center justify-center rounded-full border-2 border-white bg-brand text-xs font-bold text-brand-fg shadow transition-transform ${
                activeId === stop.place_id ? "scale-125" : ""
              }`}
            >
              {i + 1}
            </button>
          </CustomOverlayMap>
        ))}
      </Map>
    </div>
  );
}
