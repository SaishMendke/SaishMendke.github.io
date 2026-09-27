import { useEffect, useRef, useState } from "react";

const USERNAME = "SaishMendke";
const YEAR = new Date().getFullYear();
const API_URL = `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=${YEAR}`;

const LEVEL_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CELL = 10;
const GAP = 3;

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toWeeks(days) {
  const pad = parseDate(days[0].date).getUTCDay();
  const cells = [...Array(pad).fill(null), ...days];
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function monthLabels(weeks) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const month = parseDate(first.date).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ index: i, text: MONTHS[month] });
      lastMonth = month;
    }
  });
  // Drop a leading partial month whose label would collide with the next one
  if (labels.length > 1 && labels[1].index - labels[0].index < 3) labels.shift();
  return labels;
}

function formatTooltip(day) {
  const date = parseDate(day.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${day.count || "No"} ${noun} on ${date}`;
}

export default function GitHubActivity() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, []);

  // On narrow screens, scroll so the current week is in view
  useEffect(() => {
    const el = scrollRef.current;
    if (!data || !el) return;
    const dayOfYear = Math.floor((Date.now() - Date.UTC(YEAR, 0, 1)) / 86400000);
    const week = Math.floor((dayOfYear + new Date(Date.UTC(YEAR, 0, 1)).getUTCDay()) / 7);
    el.scrollLeft = (week + 1) * (CELL + GAP) - el.clientWidth;
  }, [data]);

  if (error) return null;

  const weeks = data ? toWeeks(data.contributions) : [];
  const labels = monthLabels(weeks);
  const gridHeight = 7 * CELL + 6 * GAP;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">GitHub Activity</h1>
      {!data ? (
        <div className="bg-gray-100 rounded animate-pulse" style={{ height: gridHeight + 44 }} />
      ) : (
        <>
          <div ref={scrollRef} className="overflow-x-auto pb-1">
            <div className="relative w-max">
              <div className="relative h-4 text-xs text-gray-400">
                {labels.map((label) => (
                  <span
                    key={label.index}
                    className="absolute"
                    style={{ left: label.index * (CELL + GAP) }}
                  >
                    {label.text}
                  </span>
                ))}
              </div>
              <div className="flex" style={{ gap: GAP }}>
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col" style={{ gap: GAP }}>
                    {week.map((day, j) =>
                      day ? (
                        <div
                          key={day.date}
                          title={formatTooltip(day)}
                          className="rounded-sm"
                          style={{ width: CELL, height: CELL, backgroundColor: LEVEL_COLORS[day.level] }}
                        />
                      ) : (
                        <div key={`pad-${j}`} style={{ width: CELL, height: CELL }} />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 flex-wrap gap-2">
            <a
              href={`https://github.com/${USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 no-underline hover:underline"
            >
              {data.total[YEAR].toLocaleString()} contributions in {YEAR}
            </a>
            <div className="flex items-center gap-1">
              <span>Less</span>
              {LEVEL_COLORS.map((color) => (
                <div
                  key={color}
                  className="rounded-sm"
                  style={{ width: CELL, height: CELL, backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
