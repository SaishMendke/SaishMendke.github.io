import { experience } from "../data/experience";

export default function Experience() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Experience</h1>

      <div className="space-y-8">
        {experience.map((item, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-gray-200">
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-gray-400" />
            <p className="text-sm text-gray-400">{item.period}</p>
            <h2 className="font-semibold text-gray-900 mt-0.5">{item.role}</h2>
            <p className="text-sm text-gray-600">
              {item.organization} · {item.location}
            </p>
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
