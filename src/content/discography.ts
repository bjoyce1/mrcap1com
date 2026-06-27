import albumTies from "@/assets/album-ties.webp";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import albumGrave from "@/assets/album-grave.webp";
import albumColdAss from "@/assets/album-cold-ass-pimp.webp";
import albumOneOnOne from "@/assets/album-one-on-one.webp";

export type ArchiveSingle = {
  title: string;
  artist: string;
  label: string;
  nft?: boolean;
};

export type ArchiveAlbum = {
  title: string;
  artist: string;
  year: string;
  role: string;
  label: string;
  format: string;
  image: string;
  featured?: boolean;
  description?: string;
  spotify?: string;
  apple?: string;
};

export const archiveAlbums: ArchiveAlbum[] = [
  {
    title: "The Ties That Bind Us",
    artist: "South Park Coalition",
    year: "2024",
    role: "SPC Group Album",
    label: "South Park Coalition LLC",
    format: "Digital, Album, 19 tracks",
    image: albumTies,
    featured: true,
    description:
      "SPC group album featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped version released Jan 2025.",
    apple: "https://music.apple.com/us/album/the-ties-that-bind-us/1770685229",
  },
  {
    title: "The Art Of ISM",
    artist: "Mr. CAP",
    year: "2019",
    role: "Lead artist (3rd studio album)",
    label: "Sony Music / The Orchard",
    format: "Digital, Album, 11 tracks",
    image: albumArtOfIsm,
    description:
      "Features production by Zaytoven, Metro Boomin & Mike Will Made-It. Lead single: Words Of Ism (2018)",
  },
  {
    title: "2 Tha Grave",
    artist: "Mr. CAP",
    year: "2011",
    role: "Lead artist",
    label: "Cap Records",
    format: "MP3, Album",
    image: albumGrave,
  },
  {
    title: "Tha Cold Ass Pimp",
    artist: "Tha Cold Ass Pimp",
    year: "2006",
    role: "Mixtape",
    label: "O.N.E. 4 Da Money Entertainment",
    format: "CDr, Album",
    image: albumColdAss,
  },
  {
    title: "O.N.E. on O.N.E.",
    artist: "O.N.E. & Mr. CAP",
    year: "2005",
    role: "Co-artist (collab album)",
    label: "O.N.E. 4 Da Money Entertainment",
    format: "CD, Album",
    image: albumOneOnOne,
  },
];

export const archiveSingles: { year: string; tracks: ArchiveSingle[] }[] = [
  {
    year: "2024",
    tracks: [
      { title: "Social Media is a Ho Stroll", artist: "Mr. CAP feat. Ai'Eshsa", label: "CAP Distributions" },
      { title: "Bet'n On Me", artist: "South Park Coalition", label: "South Park Coalition LLC" },
    ],
  },
  {
    year: "2023",
    tracks: [
      { title: "Dippin Thru the Metaverse", artist: "Mr. CAP (prod. Ciddy Boi P)", label: "CAP Distributions" },
      { title: "Southern Sounds (Ultra ISM)", artist: "Mr. CAP feat. Venita Vyne", label: "Power Camp" },
      { title: "H-Town Represent", artist: "Mr. CAP feat. Ciddy Boi P", label: "CAP Distributions" },
      { title: "Where the Bag At (Extended)", artist: "Mr. CAP feat. Devyn Kelly", label: "CAP Distributions" },
    ],
  },
  {
    year: "2021",
    tracks: [{ title: "Limitless", artist: "Mr. CAP feat. K-Rino", label: "Independent", nft: true }],
  },
  { year: "2019", tracks: [{ title: "Limitless", artist: "Mr. CAP", label: "Independent" }] },
  { year: "2018", tracks: [{ title: "Today Was A Great Day", artist: "Mr. CAP", label: "Independent" }] },
  {
    year: "2016",
    tracks: [
      {
        title: "No More Bloodshed",
        artist: "K-Rino / Big Deuce / Cl' Che' / Mr. Cap / Tommy-G",
        label: "Gutterlife Records",
      },
    ],
  },
  { year: "2015", tracks: [{ title: "Capism", artist: "Mr. CAP", label: "CAP Distributions" }] },
  {
    year: "2014",
    tracks: [
      { title: "I Ain't F*n With You Devils", artist: "Mr. Cap feat. Herb Of The Dynamite Squad", label: "CAP Distributions" },
      { title: "Big Navi L.A. Remix", artist: "Mr. Cap feat. Big Prez", label: "CAP Distributions" },
      { title: "Unsolved Mysteries – The Single Pt. 1", artist: "Mr Cap & K-Rino", label: "ISM Muzik" },
    ],
  },
  {
    year: "2013",
    tracks: [
      { title: "I'm Bout To Blow", artist: "Mr. CAP", label: "Cap Records" },
      { title: "2 Minute Flow", artist: "Mr. CAP", label: "CAP Distributions" },
    ],
  },
  {
    year: "2012",
    tracks: [
      { title: "Live My Life (We Hustle All Day, We Hustle All Night)", artist: "Mr. CAP", label: "CAP Distributions" },
      { title: "Cap International", artist: "Mr. Cap feat. Big Prez & Alyssa Harris", label: "Fifth Amendment Entertainment" },
      {
        title: "Pyrex (Egg Beater In Hand)",
        artist: "Mr. Cap feat. Archie Lee, Rapsta Hoffa & Young Ray Ray",
        label: "Cap Distributions",
      },
      { title: "Put The Dope Down", artist: "Mr. Cap feat. SAAK & Bosey-B", label: "CAP Distribution" },
    ],
  },
];

export const LIMITLESS_NFT_URL =
  "https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353";
