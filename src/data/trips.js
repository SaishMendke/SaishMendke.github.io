// Photo stops along each trail in the Hobbies AdventureScene, in the order they were taken.
// `at` is how far along the illustrated trail (0–100) the stop sits; `altitude` is in metres
// (named places use their usual published height, the rest come from the photo's GPS).
const files = import.meta.glob("../assets/trips/*/*-wide.webp", { eager: true, import: "default" });

const photo = (trip, id) => ({ wide: files[`../assets/trips/${trip}/${id}-wide.webp`] });

const everest = [
  { id: "E074", at: 3, day: 1, place: "Flight to Lukla", caption: "The whole Himalaya, out of a tiny plane window.", alt: "A line of snowy Himalayan peaks above forested ridges, seen from a plane." },
  { id: "E090", at: 9, day: 1, place: "Lukla", altitude: 2860, caption: "Touchdown. The peaks were already waiting.", alt: "Snow peaks above the forested ridges around Lukla under a clear blue sky." },
  { id: "E206", at: 16, day: 2, place: "Dudh Koshi valley", altitude: 2700, caption: "Morning light pouring down the valley.", alt: "Sunbeams slanting into a forested river valley, with a pine in the foreground." },
  { id: "E288", at: 23, day: 2, place: "Namche Bazaar", altitude: 3440, caption: "Clouds rolling over the ridges above Namche.", alt: "Big white clouds drifting over a long snowy ridge." },
  { id: "E342", at: 30, day: 3, place: "Above Namche", altitude: 3840, caption: "Acclimatisation day, and a first look at Everest.", alt: "Everest and Ama Dablam rising beyond a line of pine trees under scattered clouds." },
  { id: "E387", at: 37, day: 4, place: "Trail to Tengboche", altitude: 3580, caption: "The big peaks, framed by pines.", alt: "Snowy Himalayan peaks beyond a deep valley, framed by a pine tree." },
  { id: "E402", at: 44, day: 4, place: "Phunki Tenga", altitude: 3250, caption: "Ama Dablam, keeping watch for days.", alt: "The pointed summit of Ama Dablam between clouds, above a hazy valley." },
  { id: "E477", at: 51, day: 5, place: "Towards Dingboche", altitude: 3930, caption: "The valley opens up towards the giants.", alt: "A glacial river winding through a valley towards a wall of snow peaks." },
  { id: "E542", at: 58, day: 6, place: "Dingboche", altitude: 4410, caption: "Acclimatisation hike, high above a sea of clouds.", alt: "A massive snow-covered mountain rising above a layer of cloud." },
  { id: "E562", at: 65, day: 7, place: "Towards Lobuche", altitude: 4560, caption: "Ice-carved peaks above the glacier’s moraine.", alt: "Snow-dusted peaks above a long grey glacial moraine." },
  { id: "E590", at: 73, day: 7, place: "Lobuche", altitude: 4940, caption: "Snow underfoot, and the air getting thinner.", alt: "A rocky grey peak beneath billowing clouds, with snow on the valley floor." },
  { id: "E624", at: 82, day: 8, place: "Khumbu Glacier", altitude: 5130, caption: "Walking beside a river of ice.", alt: "A wall of snow and ice rising above the Khumbu Glacier." },
  { id: "E631", at: 92, day: 8, place: "Everest Base Camp", altitude: 5364, caption: "Made it. The Khumbu Icefall, right there.", alt: "The Khumbu Icefall tumbling between snow peaks above Everest Base Camp." },
  { id: "E644", at: 100, day: 9, place: "Kala Patthar trail", moment: "Sunrise", caption: "The next morning, first light turned the peaks gold.", alt: "Snow peaks lit gold by sunrise above a shadowed glacier valley." },
];

const hampta = [
  { id: "H001", at: 4, day: 1, place: "Manali", altitude: 2050, caption: "Deodar forests, and the mountains getting closer.", alt: "Tall deodar trees under puffy white clouds." },
  { id: "H007", at: 12, day: 1, place: "Jobra", altitude: 2740, caption: "The trail begins beside a roaring, ice-cold river.", alt: "A rushing, boulder-strewn river between pine-covered slopes." },
  { id: "H064", at: 20, day: 1, place: "Chika", altitude: 2870, caption: "First camp, by the river below the peaks.", alt: "A rocky river flowing towards a grey mountain at dusk, with pines on the slopes." },
  { id: "H168", at: 29, day: 2, place: "Towards Balu ka Ghera", altitude: 3380, caption: "Big clouds racing over the valley walls.", alt: "Billowing white clouds above a steep green valley." },
  { id: "H199", at: 37, day: 2, place: "Balu ka Ghera", altitude: 3560, caption: "Boulders and glacier melt, right by camp.", alt: "A clear mountain stream between boulders under big white clouds." },
  { id: "H247", at: 46, day: 3, place: "Leaving Balu ka Ghera", altitude: 3600, caption: "Pass day, starting with a frosty sunrise.", alt: "The sun bursting over a frosty valley floor between dark mountains." },
  { id: "H282", at: 54, day: 3, place: "Below the pass", altitude: 4150, caption: "Jagged spires and glaciers on the climb.", alt: "A dark rocky spire with glaciers flowing down beside it." },
  { id: "H297", at: 61, day: 3, place: "Nearly there", altitude: 4210, caption: "Cloud rolling over the glacier, just below the top.", alt: "Clouds swirling around a dark peak above a crevassed glacier." },
  { id: "H331", at: 67.8, day: 3, place: "Hampta Pass", altitude: 4300, caption: "The top. Green Kullu behind, stark Lahaul ahead.", alt: "A broad, barren valley descending between grey mountains towards distant snow peaks." },
  { id: "H337", at: 75, day: 3, place: "Descending to Shea Goru", altitude: 4250, caption: "One last look back at the snow.", alt: "A wide glacial valley leading to snowy peaks under white clouds." },
  { id: "H393", at: 83, day: 4, place: "Towards Chatru", altitude: 3680, caption: "Down a valley carved by glaciers.", alt: "A long V-shaped valley leading up to a glacier between jagged peaks." },
  { id: "H456", at: 91, day: 4, place: "Chandratal", altitude: 4300, caption: "Chandratal, the Moon Lake.", alt: "A deep blue lake at the foot of bare, ochre mountains under puffy clouds." },
  { id: "H503", at: 96, day: 4, place: "Chandra river", altitude: 4260, caption: "Golden hour over the braided Chandra river.", alt: "A braided river spreading across a wide valley under golden clouds." },
  { id: "H524", at: 100, day: 4, place: "Chandra valley", altitude: 4040, caption: "And to end it, a moonrise.", alt: "The moon rising in a dusky sky above dark, snow-tipped mountains." },
];

export const journeys = {
  everest: { when: "April 2024", stops: everest.map((stop) => ({ ...stop, ...photo("ebc", stop.id) })) },
  hampta: { when: "September 2025", stops: hampta.map((stop) => ({ ...stop, ...photo("hampta", stop.id) })) },
};
