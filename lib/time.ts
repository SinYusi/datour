// 시간대 슬라이더 범위·제약 (오전 10시 ~ 자정, 1시간 단위, 최소 2시간)
export const TIME_MIN = 10;
export const TIME_MAX = 24;
export const TIME_MIN_DURATION = 2;
export const TIME_DEFAULT: [number, number] = [18, 22];

/** 시작 시각으로 짧은 시간대 라벨(낮/저녁/밤)을 파생한다. */
export function periodShort(startHour: number): string {
  if (startHour < 17) return "낮";
  if (startHour < 20) return "저녁";
  return "밤";
}

/** 시작 시각으로 시간대 라벨을 파생한다. */
export function periodLabel(startHour: number): string {
  return `${periodShort(startHour)} 데이트`;
}

function num12(hour: number): number {
  const h = hour % 24;
  if (h === 0) return 12;
  return h <= 12 ? h : h - 12;
}

function ampm(hour: number): string {
  const h = hour % 24;
  return h < 12 ? "오전" : "오후";
}

/** 24시(자정)까지 고려한 "오전/오후 h:00" 표기. */
export function formatHour(hour: number): string {
  if (hour === 24) return "밤 12:00";
  if (hour === 12) return "낮 12:00";
  return `${ampm(hour)} ${num12(hour)}:00`;
}

/** "오후 6:00 – 10:00"처럼, 오전/오후가 같으면 뒤쪽 표기를 생략한다. */
export function formatTimeRange(start: number, end: number): string {
  const startStr = formatHour(start);
  if (end === 24 || end === 12) return `${startStr} – ${formatHour(end)}`;
  const endStr =
    ampm(start) === ampm(end) && start < 24
      ? `${num12(end)}:00`
      : formatHour(end);
  return `${startStr} – ${endStr}`;
}
