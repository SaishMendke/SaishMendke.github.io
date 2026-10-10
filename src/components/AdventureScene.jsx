import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { journeys } from "../data/trips";
import "./AdventureScene.css";

const routes = {
  everest: "M 63,334 C 111,328 116,282 170,288 S 222,252 247,263 S 303,275 329,238 S 375,190 400,208 S 449,263 471,225 S 531,221 552,185 S 601,191 620,151 Q 635,121 654,128",
  hampta: "M 63,334 C 111,328 116,282 170,288 S 222,252 247,263 S 303,275 329,238 S 375,190 400,208 S 449,263 471,225 S 531,221 552,185",
  run: "M 63,334 C 125,329 149,362 209,343 S 291,308 347,329 S 411,354 461,334 S 566,318 601,330 S 651,323 676,313",
};

// Timings for the photo stops (ms): how long a photo stays up on autoplay, the iris in/out, and the walk speed per 1% of trail.
const HOLD = 3600;
const IRIS = 750;
const WALK = 300;
const RUN = 160;
const NO_STOPS = [];
// The run has no photos yet; flip this on once it does.
const SHOW_RUN = false;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const formatAltitude = (metres) => `${metres.toLocaleString("en-US")} m`;
const stopDetail = (stop) => [`Day ${stop.day}`, stop.place, stop.altitude ? formatAltitude(stop.altitude) : stop.moment].filter(Boolean).join(" · ");

export function OutdoorIcon({ name, ...props }) {
  const paths = {
    mountain: <><path d="m2 19 7-12 4 6 3-5 6 11H2Z" /><path d="m6.5 11.5 2.5 2 2.5-2" /></>,
    run: <><circle cx="15" cy="4" r="2" /><path d="m12 9 3 3 5 1M6 11l6-2-3 7-5 5m5-5 5 1 2 5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    moon: <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />,
    play: <path d="m9 5 10 7-10 7V5Z" />,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    replay: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7" /></>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
    camera: <><path d="M3 7h4l2-3h6l2 3h4v13H3Z" /><circle cx="12" cy="13" r="3" /></>,
    book: <><path d="M12 5v15M3 4c4-1 6 0 9 1 3-1 5-2 9-1v15c-4-1-6 0-9 1-3-1-5-2-9-1V4Z" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

function Pine({ x, y, size = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}><path d="M0-36 12-14H7l9 15H-16l9-15h-5Z" fill="currentColor" /><path d="M0 0v7" stroke="currentColor" strokeWidth="3" /></g>;
}

// Pin positions are in the SVG's 720×400 viewBox; the overlays use the same box as percentages.
const toPercent = (point) => ({ "--x": `${point.x / 7.2}%`, "--y": `${point.y / 4}%` });

function TrailPhoto({ stop, origin, phase, index }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <figure className={`journey-photo journey-photo--${phase} ${loaded ? "is-loaded" : ""}`} style={toPercent(origin)}>
      <img ref={(image) => { if (image?.complete) setLoaded(true); }} src={stop.wide} alt={stop.alt} onLoad={() => setLoaded(true)} style={{ "--pan": index % 2 ? "-1.6%" : "1.6%" }} />
      <figcaption>
        <span className="journey-photo-detail">{stopDetail(stop)}</span>
        <span className="journey-photo-caption">{stop.caption}</span>
      </figcaption>
    </figure>
  );
}

export default function AdventureScene({ trek, journeyVersion, onTrekChange }) {
  const [mode, setMode] = useState("hike");
  const [sunset, setSunset] = useState(false);
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 100 : 0));
  const [previousJourney, setPreviousJourney] = useState(journeyVersion);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [inView, setInView] = useState(true);
  const [pins, setPins] = useState([]);
  const [photo, setPhoto] = useState(null);          // { index, phase: "open" | "closing" }
  const [underlay, setUnderlay] = useState(null);    // previous photo, kept beneath the next one while it irises in
  const pathRef = useRef(null);
  const travelerRef = useRef(null);
  const sceneRef = useRef(null);
  const sectionRef = useRef(null);
  const progressRef = useRef(0);
  const photoRef = useRef(null);
  const holdRef = useRef(0);
  const timerRef = useRef(null);
  const underlayTimerRef = useRef(null);
  const keysRef = useRef(null);
  const route = mode === "run" ? "run" : trek;
  const journey = mode === "hike" ? journeys[trek] : null;
  const stops = journey ? journey.stops : NO_STOPS;
  const finished = progress >= 100;
  const irisTime = reducedMotion ? 0 : IRIS;
  const reached = stops.reduce((last, stop, index) => (stop.at <= progress + 0.01 ? index : last), -1);
  const currentDay = reached >= 0 ? stops[reached].day : 1;
  const openStop = photo ? stops[photo.index] : null;

  function showPhoto(index) {
    clearTimeout(timerRef.current);
    clearTimeout(underlayTimerRef.current);
    const current = photoRef.current;
    setUnderlay(current && current.phase === "open" && current.index !== index ? current.index : null);
    if (current && current.index !== index) underlayTimerRef.current = setTimeout(() => setUnderlay(null), irisTime);
    photoRef.current = { index, phase: "open" };
    setPhoto(photoRef.current);
  }

  function hidePhoto() {
    const current = photoRef.current;
    if (!current || current.phase === "closing") return;
    clearTimeout(timerRef.current);
    setUnderlay(null);
    photoRef.current = { ...current, phase: "closing" };
    setPhoto(photoRef.current);
    timerRef.current = setTimeout(() => { photoRef.current = null; setPhoto(null); }, irisTime);
  }

  function dropPhoto() {
    clearTimeout(timerRef.current);
    clearTimeout(underlayTimerRef.current);
    photoRef.current = null;
    holdRef.current = 0;
    setPhoto(null);
    setUnderlay(null);
  }

  function moveTo(value) {
    progressRef.current = value;
    setProgress(value);
  }

  // Start the walk again whenever a trek is chosen (including the current one); keep the daylight setting.
  if (previousJourney !== journeyVersion) {
    setPreviousJourney(journeyVersion);
    setMode("hike");
    setProgress(reducedMotion ? 100 : 0);
    setPhoto(null);
    setUnderlay(null);
  }

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    clearTimeout(underlayTimerRef.current);
    photoRef.current = null;
    holdRef.current = 0;
  }, [journeyVersion]);

  useEffect(() => () => { clearTimeout(timerRef.current); clearTimeout(underlayTimerRef.current); }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  // Only walk while the scene is on screen, so nobody misses a stop while reading further down.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.35), { threshold: [0, 0.35, 0.7] });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || finished || !inView) return;
    let frame;
    let previous;
    const step = (elapsed) => {
      if (holdRef.current > 0) {
        holdRef.current -= elapsed;
        if (holdRef.current <= irisTime && photoRef.current?.phase === "open") hidePhoto();
        return;
      }
      const from = progressRef.current;
      let to = Math.min(100, from + elapsed / (mode === "run" ? RUN : WALK));
      const next = stops.findIndex((stop) => stop.at > from && stop.at <= to);
      if (next !== -1) {
        to = stops[next].at;
        showPhoto(next);
        holdRef.current = HOLD + irisTime;
      }
      moveTo(to);
    };
    const advance = (time) => {
      if (previous !== undefined) step(Math.min(time - previous, 80));
      previous = time;
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
    // showPhoto/hidePhoto only touch refs and state setters, so they are safe to leave out.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, mode, finished, inView, stops, irisTime]);

  useEffect(() => {
    const path = pathRef.current;
    const traveler = travelerRef.current;
    if (!path || !traveler) return;
    const point = path.getPointAtLength(path.getTotalLength() * progress / 100);
    traveler.setAttribute("transform", `translate(${point.x} ${point.y})`);
  }, [progress, route]);

  useLayoutEffect(() => {
    const path = pathRef.current;
    const length = path.getTotalLength();
    setPins(stops.map((stop) => path.getPointAtLength(length * stop.at / 100)));
  }, [route, stops]);

  // Warm the cache for the next two photos so each iris opens onto a ready image.
  useEffect(() => {
    if (!inView) return;
    [reached + 1, reached + 2].forEach((index) => { if (stops[index]) new Image().src = stops[index].wide; });
  }, [reached, inView, stops]);

  const walking = !reducedMotion && !finished && inView && !photo;
  const status = finished ? (mode === "run" ? "Finish line. That felt good." : "Made it. Take in the view.")
    : mode === "run" ? "One stride at a time." : progress < 30 ? "Every adventure starts with a step." : progress < 70 ? "Finding the quieter way up." : "The view is worth the climb.";

  // Pins only exist for places already reached, so revisiting one shows its photo without walking the hiker back.
  function goToStop(index) {
    if (!stops[index]) return;
    showPhoto(index);
    holdRef.current = HOLD + irisTime;
  }

  function closeStop() {
    holdRef.current = reducedMotion ? 0 : irisTime;
    hidePhoto();
  }

  function changeMode(nextMode) {
    dropPhoto();
    setMode(nextMode);
    moveTo(reducedMotion ? 100 : 0);
  }

  function selectTrek(nextTrek) {
    onTrekChange(nextTrek);
  }

  function handleKeys(event) {
    if (!photo || photo.phase !== "open" || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest?.("dialog, input, textarea, select, [contenteditable]")) return;
    if (event.key === "Escape") closeStop();
  }

  useEffect(() => {
    keysRef.current = handleKeys;
  });

  // Escape closes an open photo whenever the scene is on screen, not only while focus is inside it.
  useEffect(() => {
    if (!photo || !inView) return;
    const onKey = (event) => keysRef.current(event);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photo, inView]);

  function moveLandscape(event) {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    sceneRef.current.style.setProperty("--drift", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 10}px`);
  }

  return (
    <section ref={sectionRef} className={`adventure ${sunset ? "adventure--sunset" : ""} ${walking ? "adventure--moving" : ""} ${mode === "run" ? "adventure--run" : ""} ${photo ? "adventure--photo" : ""}`} aria-label="Interactive outdoor adventure">
      <div className="adventure-toolbar">
        <div className="adventure-modes" role="group" aria-label="Choose an adventure">
          <button className={mode === "hike" && trek === "everest" ? "is-active" : ""} aria-pressed={mode === "hike" && trek === "everest"} onClick={() => selectTrek("everest")}><OutdoorIcon name="mountain" /> Everest Base Camp</button>
          <button className={mode === "hike" && trek === "hampta" ? "is-active" : ""} aria-pressed={mode === "hike" && trek === "hampta"} onClick={() => selectTrek("hampta")}><OutdoorIcon name="mountain" /> Hampta Pass</button>
          {SHOW_RUN && <button className={mode === "run" ? "is-active" : ""} aria-pressed={mode === "run"} onClick={() => changeMode("run")}><OutdoorIcon name="run" /> Go for a run</button>}
        </div>
        <button className="adventure-daylight" onClick={() => setSunset(!sunset)} aria-label={sunset ? "Switch to daylight" : "Switch to sunset"} aria-pressed={sunset} title={sunset ? "Switch to daylight" : "Catch the sunset"}><OutdoorIcon name={sunset ? "moon" : "sun"} /></button>
      </div>

      <div ref={sceneRef} className="adventure-landscape" onPointerMove={moveLandscape} onPointerLeave={() => sceneRef.current.style.setProperty("--drift", "0px")}>
        <div className="adventure-scene-caption"><span className="adventure-eyebrow">{mode === "hike" ? "A Himalayan daydream" : "The scenic route"}</span><p>{mode === "hike" ? "Somewhere, the mountains are calling." : "Less screen time. More kilometres."}</p></div>
        <svg className="adventure-art" viewBox="0 0 720 400" fill="none" role="img" aria-labelledby="landscape-title landscape-description">
          <title id="landscape-title">{mode === "hike" ? "A hiker on a winding mountain trail" : "A runner on a trail beneath the mountains"}</title>
          <desc id="landscape-description">An imagined Himalayan landscape with layered mountains, pine trees, drifting clouds and a {mode === "hike" ? "hiker" : "runner"}. Use the controls below to move along the trail{mode === "hike" ? ", with photos from along the way" : ""}.</desc>
          <defs>
            <linearGradient id="adventure-sky" x2="0" y2="1"><stop stopColor="var(--sky-top)" /><stop offset="1" stopColor="var(--sky-bottom)" /></linearGradient>
            <linearGradient id="adventure-ridge" x2="0.6" y2="1"><stop stopColor="var(--ridge-top)" /><stop offset="1" stopColor="var(--ridge-bottom)" /></linearGradient>
            <pattern id="adventure-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".5" fill="#ffffff" opacity=".16" /></pattern>
          </defs>
          <path fill="url(#adventure-sky)" d="M0 0h720v400H0Z" />
          <g className="adventure-distant">
            <circle className="adventure-sun" cx="564" cy="82" r="32" fill="var(--sun)" />
            <circle cx="564" cy="82" r="43" stroke="var(--sun)" strokeOpacity=".22" strokeWidth="12" />
            <g className="adventure-cloud adventure-cloud--one" fill="var(--cloud)"><path d="M74 121c0-8 8-12 15-10 0-13 20-18 27-7 11-5 21 2 20 12 11 0 15 11 6 13H82c-8 0-12-4-8-8Z" /></g>
            <g className="adventure-cloud adventure-cloud--two" fill="var(--cloud)"><path d="M440 74c0-8 8-12 15-10 0-13 20-18 27-7 11-5 21 2 20 12 11 0 15 11 6 13h-60c-8 0-12-4-8-8Z" /></g>
            <path d="m334 98 5-3 5 3m14 9 4-2 4 2" stroke="var(--bird)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M-40 252 87 138 141 182 207 104 282 196 339 126 422 213 496 97 581 196 651 78 765 216v184H-40Z" fill="var(--far-mountain)" />
            <path d="m207 104-35 44 19-6 13 13 11-12 19 13Zm289-7-28 40 20-8 13 13 10-10 19 7Zm155-19-33 56 19-12 14 13 10-13 16 9Z" fill="var(--snow)" />
            <path d="m207 104 75 92-62-47Zm289-7 85 99-73-59Zm155-19 114 138-101-86Z" fill="var(--mountain-shadow)" opacity=".42" />
          </g>
          <g className="adventure-middle">
            <path d="M-35 327 62 223 136 281 230 179 315 287 400 197 474 279 654 117 761 244v156H-35Z" fill="var(--middle-mountain)" />
            <path d="m230 179 85 108-96-68Zm170 18 74 82-69-41Zm254-80 107 127-111-83Z" fill="var(--middle-shadow)" />
            <path d="m654 117-34 36 21-5 12 9 7-13 19 4Z" fill="var(--snow)" />
            <path d="M-20 337c63-71 112-56 181-25s82-76 146-50 63-39 93-44 48 81 90 45 82-59 141-37 99 17 119 28v146H-20Z" fill="url(#adventure-ridge)" />
            <path d="M-20 337c63-71 112-56 181-25s82-76 146-50 63-39 93-44" stroke="var(--ridge-highlight)" strokeWidth="2" opacity=".5" />
            <path d="M-20 379c99-45 136-20 204-25s80-36 147-13 81 11 133-6 116-8 155 4 96-13 131-5v66H-20Z" fill="var(--near-hill)" />
          </g>
          <g className="adventure-trees" color="var(--tree)">
            <Pine x={27} y={337} size={.9} /><Pine x={46} y={347} size={.65} /><Pine x={104} y={330} size={.6} />
            <Pine x={128} y={340} size={.8} /><Pine x={287} y={310} size={.55} /><Pine x={305} y={318} size={.8} />
            <Pine x={496} y={305} size={.7} /><Pine x={515} y={298} size={.5} /><Pine x={689} y={301} size={.65} />
          </g>
          {route === "hampta" && (
            <g className="adventure-lake">
              <path d="M538 189c9-6 31-7 41-2 6 3 2 8-8 9-14 2-31 1-37-2-4-2-2-3 4-5Z" fill="var(--lake)" />
              <path d="M548 190c8-2 18-2 24 0" stroke="var(--lake-shine)" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
          <path d={routes[route]} stroke="var(--trail-shadow)" strokeWidth="5" strokeLinecap="round" opacity=".15" />
          <path ref={pathRef} d={routes[route]} stroke="var(--trail)" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
          <path d={routes[route]} stroke="var(--trail)" strokeWidth="2.5" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress} strokeLinecap="round" />
          <g transform={`translate(${mode === "run" ? 676 : trek === "hampta" ? 400 : 654} ${mode === "run" ? 313 : trek === "hampta" ? 208 : 128})`}>
            <circle r="6" fill="var(--trail)" opacity=".25" /><circle r="2.5" fill="var(--trail)" />
            <path d="M0-3v-26" stroke="var(--flagpole)" strokeWidth="1.8" /><path d="M1-29h16l-4 5 4 5H1Z" fill="#d98453" />
          </g>
          <g ref={travelerRef} className="adventure-traveler">
            <ellipse cx="0" cy="2" rx="9" ry="2.5" fill="#173b31" opacity=".16" />
            <g className="adventure-person">
              <path className="adventure-leg adventure-leg--back" d="M0-12-4-6-7 0" stroke="#27463e" strokeWidth="3" strokeLinecap="round" />
              <path className="adventure-leg adventure-leg--front" d="M0-12 3-6 6 0" stroke="#27463e" strokeWidth="3" strokeLinecap="round" />
              <path d="M-1-23 1-12" stroke="#da8055" strokeWidth="7" strokeLinecap="round" />
              {mode === "hike" && <rect x="-8" y="-25" width="6" height="11" rx="2" fill="#e8bc73" transform="rotate(-8 -5 -20)" />}
              <path className="adventure-arm" d={mode === "run" ? "M0-21 5-17 10-21" : "M0-21 6-16 10-18"} stroke="#d98453" strokeWidth="2.8" strokeLinecap="round" />
              {mode === "hike" && <path d="m10-20-1 21" stroke="#42564b" strokeWidth="1.3" />}
              <circle cx="-2" cy="-30" r="4" fill="#dca783" />
              <path d="M-6-32c0-5 8-5 8 0H-6Z" fill="#34584d" /><path d="M-6-32H5" stroke="#34584d" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
          <g className="adventure-foreground" color="var(--foreground)"><Pine x={-3} y={396} size={2.1} /><Pine x={25} y={416} size={1.6} /><Pine x={709} y={408} size={1.9} /><Pine x={736} y={412} size={2.5} /></g>
          <path fill="url(#adventure-grain)" d="M0 0h720v400H0Z" pointerEvents="none" />
          <g fill="var(--label)" fontSize="10" fontFamily="inherit" letterSpacing="1.2">
            <text x="61" y="368">TRAILHEAD</text>
            <text x={mode === "run" ? 596 : trek === "hampta" ? 372 : 568} y={mode === "run" ? 286 : trek === "hampta" ? 181 : 104}>{mode === "run" ? "THE NEXT 10K" : trek === "hampta" ? "HAMPTA PASS" : "EVEREST BASE CAMP"}</text>
            {route === "hampta" && <text x="538" y="176">CHANDRATAL</text>}
          </g>
        </svg>

        {stops.length > 0 && (
          <div className="journey-pins">
            {stops.map((stop, index) => pins[index] && index <= reached && (
              <button key={stop.id} className={`journey-pin ${photo?.index === index ? "is-active" : ""}`} style={toPercent(pins[index])} onClick={() => goToStop(index)} aria-label={`Look again: ${stopDetail(stop)}`} title={stop.place} />
            ))}
          </div>
        )}

        <div className="journey-photos">
          {underlay !== null && stops[underlay] && <TrailPhoto key={`under-${stops[underlay].id}`} stop={stops[underlay]} origin={pins[underlay]} phase="under" index={underlay} />}
          {openStop && pins[photo.index] && <TrailPhoto key={openStop.id} stop={openStop} origin={pins[photo.index]} phase={photo.phase} index={photo.index} />}
        </div>

        {openStop && photo.phase === "open" && (
          <div className="journey-photo-ui">
            <button className="journey-photo-close" onClick={closeStop} aria-label="Close photo and return to the trail" title="Back to the trail"><OutdoorIcon name="close" /></button>
          </div>
        )}

        <div className="adventure-map-note">A little imagination, a lot of wanderlust.</div>
        <p className="journey-live" aria-live="polite">{openStop && photo.phase === "open" ? `${stopDetail(openStop)}. ${openStop.caption}` : ""}</p>
      </div>

      <div className="adventure-controls">
        <div className="adventure-journey-heading">
          <div><span className="adventure-eyebrow">{mode === "run" ? "The everyday adventure" : `${trek === "hampta" ? "4,300 m · Hampta Pass" : "5,364 m · Everest Base Camp"} · ${journey.when}`}</span><p>{status}{finished && !reducedMotion && mode === "hike" && <button className="adventure-again" onClick={() => selectTrek(trek)}><OutdoorIcon name="replay" width="12" height="12" /> Walk it again</button>}</p></div>
          <span className="adventure-progress-number">{mode === "run" ? <>{Math.round(progress)}<small>%</small></> : <><small className="adventure-progress-label">Day</small>{currentDay}</>}</span>
        </div>
      </div>

    </section>
  );
}
