export const bookingPageData = {
  hero: {
    kicker: "Bookings & Inquiries",
    title: "Book Mr. CAP",
    description:
      "Available for live shows, features, interviews, speaking engagements, and select appearances. Based in Houston, TX. Available worldwide.",
    ctas: [
      { label: "Submit Inquiry", href: "#inquiry-form", variant: "primary" as const },
      { label: "Download EPK", href: "/opk", variant: "secondary" as const },
    ],
  },
  intro:
    "Mr. CAP is a Houston-born rapper, South Park Coalition original member, and creative technologist with a catalog built on independence, longevity, and live presence.",
  options: [
    { title: "Live Performance", description: "Full set or featured appearance." },
    { title: "Verse / Feature Request", description: "Music collaborations and custom requests." },
    { title: "Interview / Podcast", description: "Press, radio, and media appearances." },
    { title: "Speaking Engagement", description: "Culture, ownership, independence, and music-business conversations." },
  ],
  whyBook:
    "Houston credibility. SPC legacy. Professional delivery. A catalog built for both live performance and long-form conversation.",
  infoStrip: {
    label: "Press Support",
    body: "Chronicle and Houston Press coverage are available in the Press section, along with official links and downloadable materials for media and promoters.",
    ctas: [
      { label: "View Press", href: "/press" },
      { label: "Download EPK", href: "/opk" },
    ],
  },
  faq: [
    { question: "Where are you based?", answer: "Houston, Texas." },
    { question: "Do you travel?", answer: "Yes. Mr. CAP is available worldwide." },
    { question: "What can be booked?", answer: "Live shows, features, interviews, speaking engagements, and select appearances." },
  ],
  citation: {
    canonicalUrl: "https://mrcap1.com/booking",
    description:
      "This page is the official booking and inquiry page for Mr. CAP, including performance requests, media appearances, and speaking engagements.",
    links: [
      { label: "Press", href: "/press" },
      { label: "Music", href: "/music" },
      { label: "Home", href: "/" },
    ],
  },
};
