import { papers } from "../data/papers";

export default function Papers() {
  const grouped = Object.groupBy(papers, (p) => p.year);
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Papers</h1>

      {years.map((year) => (
        <div key={year} className="mb-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">{year}</h2>
          <div className="space-y-4">
            {grouped[year].map((paper, i) => (
              <div key={i}>
                <p className="font-medium text-gray-900">{paper.title}</p>
                <p className="text-sm text-gray-400 italic">{paper.venue}</p>
                <p className="text-sm text-gray-500 mt-1">{paper.description}</p>
                {paper.link && (
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 no-underline hover:underline mt-1"
                  >
                    Paper
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
