import ebcPhoto from "../assets/everest_base_camp.jpg";
import hamptaPhoto from "../assets/hampta_pass2.jpg";

const trekPhotos = [
  { src: ebcPhoto, alt: "Everest Base Camp", caption: "Everest Base Camp (5,364 m)" },
  { src: hamptaPhoto, alt: "Hampta Pass", caption: "Hampta Pass (4,300 m)" },
];

export default function Hobbies() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Hobbies</h1>

      <div className="text-gray-600 leading-relaxed space-y-3">
        <p>
          I like clicking photos and capturing memories. You can check out some of my work on
          my{" "}
          <a href="https://sites.google.com/view/saish-mendke-photogallery" target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
            photo gallery
          </a>.
        </p>
        <p>
          I love travelling and trekking. I've completed the trek to Everest Base Camp (5,364 m)
          and Hampta Pass (4,300 m). I enjoy visiting quiet places and being outdoors.
        </p>
        <p>
          I run regularly, usually 10Ks, and I'm planning to run a half marathon this year.
          And sometimes I read — mostly non-fiction.
        </p>
      </div>

      <div className="flex gap-4 mt-6 flex-col sm:flex-row">
        {trekPhotos.map((photo) => (
          <div key={photo.alt} className="flex-1">
            <img
              src={photo.src}
              alt={photo.alt}
              className="rounded-lg w-full h-48 object-cover"
            />
            <p className="text-xs text-gray-400 mt-1">{photo.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
