import { useState } from "react";
import AdventureScene, { OutdoorIcon } from "../components/AdventureScene";
import StravaWidgets from "../components/StravaWidgets";
import { strava } from "../data/strava";

export default function Hobbies() {
  const [journey, setJourney] = useState({ trek: "everest", version: 0 });
  const trek = journey.trek;

  function selectTrek(id) {
    setJourney((current) => ({ trek: id, version: current.version + 1 }));
  }

  return (
    <div className="hobbies-page">
      <header className="hobbies-intro">
        <span className="hobbies-kicker">Hobbies / life beyond the screen</span>
        <h1>A little further. <em>A little higher.</em></h1>
        <p>I love quiet places, long trails, and the feeling of being outdoors. When I’m away from my desk, this is usually where you’ll find me.</p>
      </header>

      <AdventureScene trek={trek} journeyVersion={journey.version} onTrekChange={selectTrek} />

      <section className="hobby-notes" aria-label="More things I enjoy">
        <article><OutdoorIcon name="run" className="hobby-note-icon" /><h2>One more kilometre.</h2><p>I run regularly, usually 10Ks. Next up: working towards a half marathon.</p><a href={strava.profileUrl} target="_blank" rel="noreferrer">Follow along on Strava <OutdoorIcon name="arrow" width="12" height="12" /></a></article>
        <article><OutdoorIcon name="camera" className="hobby-note-icon" /><h2>Keep the moment.</h2><p>I like clicking photos. A good view is even better when you can take a little of it home.</p><a href="https://sites.google.com/view/saish-mendke-photogallery" target="_blank" rel="noreferrer">Visit my photo gallery <OutdoorIcon name="arrow" width="12" height="12" /></a></article>
        <article><OutdoorIcon name="book" className="hobby-note-icon" /><h2>A slower kind of adventure.</h2><p>Sometimes, the best journey is a good book. Mostly non-fiction, always something to learn.</p></article>
      </section>

      <StravaWidgets />
      <p className="hobbies-signoff">Here’s to taking the scenic route.</p>
    </div>
  );
}
