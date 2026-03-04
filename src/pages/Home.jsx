import profilePic from "../assets/profile_pic_3.jpg";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={profilePic}
          alt="Saish Mendke"
          className="w-40 h-40 rounded-lg object-cover flex-shrink-0"
        />

        <div>
          <h1 className="text-2xl font-bold mb-3">Hi, I'm Saish Mendke</h1>
          <p className="text-gray-600 leading-relaxed mb-4">
            I'm a Software Engineer who enjoys building systems that work at scale and solve
            real-world problems. I currently work at Microsoft and graduated from National
            Institute of Technology Surathkal with a B.Tech in Computer Science (CGPA: 9.53/10).
          </p>
          <div className="flex gap-4 text-sm flex-wrap">
            <a href="https://www.linkedin.com/in/saish-mendke-482910194/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/SaishMendke/" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://scholar.google.com/citations?hl=en&user=6eg3JWcAAAAJ" target="_blank" rel="noreferrer">
              Google Scholar
            </a>
            <a href="mailto:saishmendke10@gmail.com">Email</a>
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Work</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          I currently work with the Bing Responsible AI team at Microsoft, supporting products
          like Bing and Copilot in ensuring the safety of end users from harmful and problematic
          content. I primarily work on metrics (understanding where we stand and how systems
          perform today) and mitigations (signals and interventions that help take down or
          generate safer alternatives to content).
        </p>
        <p className="text-gray-600 leading-relaxed mb-3">
          At Microsoft, I've published two research papers and a patent focused on reducing
          inconsistency in large language models.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Previously, I interned at Microsoft (Bing Autosuggest) and at Indian Institute of
          Technology Madras, where I worked on deep learning systems.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Outside Work</h2>
        <p className="text-gray-600 leading-relaxed">
          I love travelling, trekking, running, and cooking. When I'm not building or learning
          something new, you'll probably find me outdoors -- playing or running.
          I've completed the trek to Everest Base Camp (5,364 m) and Hampta Pass (4,300 m)
          — experiences that pushed me physically and mentally, and that I deeply value.
        </p>
      </section>
    </div>
  );
}
