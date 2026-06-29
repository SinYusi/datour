"use client";

import { Fragment, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { POPULAR_REGIONS, searchRegions, type Region } from "@/lib/regions";
import { Chip } from "./chip";

interface RegionStepProps {
  selected: Region | null;
  onSelect: (region: Region) => void;
}

/** 검색어와 일치하는 부분만 브랜드 색으로 강조한다. */
function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <Fragment>
      {text.slice(0, idx)}
      <span className="text-brand">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </Fragment>
  );
}

export function RegionStep({ selected, onSelect }: RegionStepProps) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  const results = searchRegions(query);

  return (
    <div className="mt-2 flex flex-1 flex-col">
      <h1 className="text-[23px] leading-[1.3] font-bold tracking-[-0.02em] text-foreground">
        어디서
        <br />
        만날까요?
      </h1>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-border px-3.5 py-3 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        <Search className="size-[17px] shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="지역 검색 (예: 성수, 홍대)"
          aria-label="지역 검색"
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="검색어 지우기"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {searching ? (
        results.length > 0 ? (
          <ul className="mt-3.5 flex flex-col">
            {results.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onSelect(r)}
                  aria-pressed={selected?.id === r.id}
                  className="flex w-full items-center gap-3 border-b border-border/60 py-3 text-left last:border-0"
                >
                  <MapPin
                    className={`size-[18px] shrink-0 ${selected?.id === r.id ? "text-brand" : "text-muted-foreground/60"}`}
                    aria-hidden
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {highlight(r.name, query)}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {highlight(r.gu, query)}
                      {r.description && ` · ${r.description}`}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            &lsquo;{query}&rsquo; 검색 결과가 없어요.
          </p>
        )
      ) : (
        <div className="mt-6">
          <p className="text-xs font-medium text-muted-foreground">인기 지역</p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {POPULAR_REGIONS.map((r) => (
              <Chip
                key={r.id}
                label={r.name}
                selected={selected?.id === r.id}
                onClick={() => onSelect(r)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
