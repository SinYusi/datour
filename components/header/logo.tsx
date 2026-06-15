import { MapPin } from "@/components/map-pin";

/**
 * Datour 워드마크. 'o'를 지도핀으로 치환해 "장소/지도" 정체성을 글자에 담는다.
 * 핀이 글자를 대체하므로 전체에 aria-label을 주고 시각 요소는 aria-hidden 처리.
 */
export function Logo() {
  return (
    <span
      aria-label="Datour"
      className="text-xl font-bold tracking-[-0.03em] text-foreground select-none"
    >
      <span aria-hidden className="inline-flex items-baseline">
        Dat
        <MapPin
          size={14}
          className="mx-px translate-y-0.5 text-brand dark:text-[#2BA888]"
        />
        ur
      </span>
    </span>
  );
}
