import type { SVGProps } from "react";

interface MapPinProps extends SVGProps<SVGSVGElement> {
  /** 핀 너비(px). 높이는 24:33 비율로 자동 계산된다. */
  size?: number;
}

/**
 * 물방울 지도 핀. 안쪽 구멍은 evenodd로 실제로 뚫려 있어 어떤 배경에도 얹힌다.
 * 색은 `currentColor`를 따르므로 `text-brand` 등 텍스트 컬러 유틸로 제어한다.
 * 워드마크의 'o', 지도 마커 등에 재사용.
 */
export function MapPin({ size = 24, ...props }: MapPinProps) {
  return (
    <svg
      width={size}
      height={(size * 33) / 24}
      viewBox="0 0 24 33"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C6 1 1.5 5.5 1.5 11.5 1.5 19 12 31 12 31S22.5 19 22.5 11.5C22.5 5.5 18 1 12 1ZM12 7.5a4 4 0 1 0 0 8 4 4 0 1 0 0-8Z"
      />
    </svg>
  );
}
