/**
 * Shared press kit content — used by /press-kit page and the
 * Press Kit modal on /who-is-mr-cap.
 */

export const SHORT_BIO =
  "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, South Park Coalition original member, creative technologist, and founder of CAP Distributions. His catalog spans over two decades — from 2003's Cold Ass Pimp to 2024's The Ties That Bind Us — bridging underground hip-hop, blockchain innovation, and independent ownership.";

export const LONG_BIO =
  "Cornelius A. Pratt, known professionally as Mr. CAP, is a rapper, writer, and entrepreneur from Houston's Third Ward. A graduate of Jack Yates High School, he became one of the original members of the South Park Coalition — one of the longest-running hip-hop collectives in history, founded in 1987. Over a career spanning five studio albums (Cold Ass Pimp, O.N.E. on O.N.E., 2 Tha Grave, The Art of ISM, The Ties That Bind Us), Mr. CAP has built an independent catalog distributed through Sony Music / The Orchard, DistroKid, and his own blockchain-powered channels. Beyond music, he leads CAP Distributions, Mortuary Media LLC, and Wreckless Entertainment — ventures that reflect his commitment to ownership and long-term creative control. His contributions extend to film; the documentary 'The Life: Sex Trafficking and Modern-Day Slavery,' which he helped produce, received a 2024 Lone Star Emmy Award nomination.";

export const PRESS_MENTIONS = [
  { outlet: "Houston Chronicle", title: "The Resurgence of Houston Hip-Hop", date: "2024" },
  { outlet: "Houston Press", title: "Mr. CAP and the SPC Legacy", date: "2023" },
  { outlet: "Mr. CAP Legacy", title: "Bet'n On Me — Official Press Release", date: "2024" },
  { outlet: "Mr. CAP Legacy", title: "Inside The Ties That Bind Us", date: "2024" },
];

export const PHOTO_ASSETS = [
  { label: "Press Photo — Hero Shot", file: "/images/opk-og-image.jpg" },
  { label: "Press Photo — Studio", file: "/images/cap-wiz-2.jpg" },
  { label: "Press Photo — About", file: "/images/about-bg.webp" },
];

export const LOGO_ASSETS = [
  { label: "Mr. CAP Logo", file: "/images/opk-download.webp" },
  { label: "SPC Austin 2025 Mark", file: "/images/covers/pomp-standard.webp" },
];

export const DISCOGRAPHY_HIGHLIGHTS = [
  { title: "The Ties That Bind Us", year: "2024", role: "SPC Group Album" },
  { title: "The Art of ISM", year: "2019", role: "Solo Album — Sony / The Orchard" },
  { title: "2 Tha Grave", year: "2011", role: "Solo Album" },
  { title: "O.N.E. on O.N.E.", year: "2005", role: "Solo Album" },
  { title: "Cold Ass Pimp", year: "2003", role: "Solo Album" },
];

export const OFFICIAL_LINKS = [
  { label: "Website", url: "mrcap1.com" },
  { label: "Spotify", url: "open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" },
  { label: "Instagram", url: "@mrcapism" },
  { label: "YouTube", url: "@mrcap1" },
  { label: "X/Twitter", url: "@mrcap1" },
];

/**
 * Opens a printer-friendly Press Kit document in a new window and
 * auto-triggers the browser Save-as-PDF / Print dialog.
 */
export function openPressKitPDF() {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  const contact = ["wreck", "lessent", "@", "gmail.com"].join("");
  printWindow.document.write(`<!DOCTYPE html><html><head><title>Mr. CAP — Press Kit</title><style>
    body{font-family:system-ui,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#111;line-height:1.6}
    h1{font-size:28px;margin-bottom:4px}
    h2{font-size:18px;margin-top:28px;border-bottom:1px solid #ddd;padding-bottom:6px}
    .label{font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:4px}
    .item{margin:8px 0}.meta{font-size:13px;color:#666}
    img{max-width:200px;margin:8px 8px 8px 0}
    @media print{body{margin:20px}}
  </style></head><body>
    <h1>Mr. CAP — Official Press Kit</h1>
    <p class="meta">Cornelius A. Pratt | Houston Hip-Hop Artist | South Park Coalition<br/>
    Contact: ${contact} | mrcap1.com</p>

    <h2>Short Bio</h2>
    <p>${SHORT_BIO}</p>

    <h2>Extended Bio</h2>
    <p>${LONG_BIO}</p>

    <h2>Discography Highlights</h2>
    ${DISCOGRAPHY_HIGHLIGHTS.map(a => `<div class="item"><strong>${a.title}</strong> (${a.year}) — ${a.role}</div>`).join("")}

    <h2>Press References</h2>
    ${PRESS_MENTIONS.map(m => `<div class="item"><strong>${m.title}</strong><br/><span class="meta">${m.outlet} · ${m.date}</span></div>`).join("")}

    <h2>Press Photos</h2>
    <p class="meta">High-resolution images available at mrcap1.com/press-kit</p>
    ${PHOTO_ASSETS.map(p => `<img src="https://mrcap1.com${p.file}" alt="${p.label}"/>`).join("")}

    <h2>Official Links</h2>
    ${OFFICIAL_LINKS.map(l => `<div class="item">${l.label}: ${l.url}</div>`).join("")}

    <hr style="margin-top:30px"/>
    <p class="meta">© Mr. CAP Legacy · Est. Houston TX · mrcap1.com/press-kit</p>
  </body></html>`);
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 400);
}
