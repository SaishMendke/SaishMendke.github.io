import { papers } from "../data/papers";
import { projects } from "../data/projects";

export default function Projects() {
  return (
    <div>
      {/* Papers */}
      <h1 className="text-2xl font-bold mb-6">Papers</h1>
      <div className="space-y-4 mb-12">
        {papers.map((paper, i) => (
          <div key={i}>
            <p className="font-medium text-gray-900">{paper.title}</p>
            <p className="text-sm text-gray-400 italic">{paper.venue}</p>
            <p className="text-sm text-gray-500 mt-1">{paper.description}</p>
            <a
              href={paper.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 no-underline hover:underline mt-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Paper
            </a>
          </div>
        ))}
      </div>

      {/* Projects */}
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="space-y-4">
        {projects.map((project, i) => (
          <div key={i}>
            <p className="font-medium text-gray-900">{project.title}</p>
            <p className="text-sm text-gray-500 mt-0.5">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
