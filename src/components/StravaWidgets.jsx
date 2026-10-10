import { strava } from "../data/strava";

// Sizes match Strava's own embed codes
const WIDGETS = [
  { key: "activitySummaryUrl", title: "Strava weekly running summary", height: 160 },
  { key: "latestRunsUrl", title: "Latest runs on Strava", height: 454 },
];

export default function StravaWidgets() {
  const widgets = WIDGETS.filter((w) => strava[w.key]);
  if (!strava.enabled || !widgets.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Running</h2>
      <div className="flex flex-wrap items-start gap-4">
        {widgets.map((w) => (
          <iframe
            key={w.key}
            src={strava[w.key]}
            title={w.title}
            width={300}
            height={w.height}
            loading="lazy"
            className="border-0 max-w-full"
          />
        ))}
      </div>
      {strava.profileUrl && (
        <a
          href={strava.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-xs text-gray-500 no-underline hover:underline mt-2"
        >
          Follow me on Strava
        </a>
      )}
    </section>
  );
}
