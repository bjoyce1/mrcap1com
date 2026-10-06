/**
 * FAQ copy, kept in one place so a page's visible FAQ and its FAQPage JSON-LD
 * always say the same thing.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    question: "Who is Mr. CAP?",
    answer:
      "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, an Original Member of the South Park Coalition, and a creative technologist. He has been making music for over 30 years and became the first Houston rapper to sell a hip-hop NFT in 2021.",
  },
  {
    question: "What is South Park Coalition?",
    answer:
      "South Park Coalition (SPC) is a legendary hip-hop collective founded in Houston, Texas. Mr. CAP is an Original Member alongside artists like K-Rino, Klondike Kat, and Point Blank.",
  },
  {
    question: "How can I book Mr. CAP for a show?",
    answer:
      "Submit a booking request through the official form at mrcap1.com/booking. Mr. CAP is available for concerts, festivals, speaking engagements, and special events across Texas and beyond.",
  },
  {
    question: "What is Mr. CAP's latest album?",
    answer:
      "Mr. CAP's latest group project is The Ties That Bind Us (2024), a South Park Coalition album with 19 tracks and the lead single Bet'n On Me.",
  },
];

export const SPC_FAQ: FaqItem[] = [
  {
    question: "Who are the key members of the South Park Coalition and their impact?",
    answer:
      "Key SPC members include K-Rino (founder), Mr. CAP, Klondike Kat, Dope-E, Point Blank, Low-G, and Ganksta N-I-P. The coalition pioneered independent hip-hop distribution in Texas and proved artists could build sustainable careers without major label support.",
  },
  {
    question: "How did the South Park Coalition influence underground rap?",
    answer:
      "SPC created the blueprint for independent hip-hop: direct-to-fan distribution, full creative ownership, and community-driven growth, decades before streaming platforms made independence mainstream.",
  },
  {
    question: "What defines Houston hip-hop culture and its independent sound?",
    answer:
      "Houston hip-hop culture is defined by independence, authenticity, and hustle. Artists pressed their own CDs, sold music hand-to-hand, and built loyal audiences without relying on major labels, a model the South Park Coalition helped pioneer.",
  },
  {
    question: "What makes independent hip-hop artists successful long-term?",
    answer:
      "Ownership, consistency, and direct audience connection. Artists like Mr. CAP and the South Park Coalition proved that longevity comes from controlling your own catalog, building genuine fan relationships, and never compromising creative vision.",
  },
];

export const HOUSTON_HISTORY_FAQ: FaqItem[] = [
  {
    question: "What is Mr. CAP known for in Houston hip-hop?",
    answer:
      "Mr. CAP is a Houston-born rapper and an Original Member of the South Park Coalition, known for independent music, longevity, and innovation across music and Web3. His catalog spans over two decades of authentic Houston hip-hop.",
  },
  SPC_FAQ[2],
  SPC_FAQ[1],
  {
    question: "Why do independent hip-hop artists like Mr. CAP avoid major labels?",
    answer:
      "Independent artists like Mr. CAP prioritize ownership, creative control, and direct audience connection, principles pioneered by the South Park Coalition decades before streaming made independence mainstream.",
  },
  {
    question: "How can I book Mr. CAP for a live performance?",
    answer:
      "Visit mrcap1.com/booking to submit a booking inquiry. Mr. CAP is available for live shows, features, interviews, and speaking engagements worldwide.",
  },
];

export const TEXAS_UNDERGROUND_FAQ: FaqItem[] = [
  {
    question: "What is Texas underground hip-hop?",
    answer:
      "Texas underground hip-hop refers to the independent rap scene in Texas, particularly Houston, Dallas, and San Antonio. It includes artists who release music independently, often through their own labels, without major label support. Key figures include South Park Coalition, Swishahouse, and Screwed Up Click.",
  },
  {
    question: "Who are the pioneers of Houston underground hip-hop?",
    answer:
      "Pioneers of Houston underground hip-hop include DJ Screw (chopped and screwed music), K-Rino and the South Park Coalition (independent rap collective), Scarface and the Geto Boys (bringing Houston to mainstream), and artists like Mr. CAP, Z-Ro, and Trae tha Truth who built careers independently.",
  },
  {
    question: "How is Texas underground hip-hop different from mainstream rap?",
    answer:
      "Texas underground hip-hop is characterized by independence (artists own their masters), lyrical focus (complex wordplay and storytelling), regional pride (Houston, Dallas, San Antonio identity), and longevity (careers spanning decades vs. one-hit wonders). Artists like Mr. CAP have been active for 30+ years.",
  },
];

export const WHO_IS_FAQ: FaqItem[] = [
  {
    question: "Who is Mr. CAP?",
    answer:
      "Mr. CAP (Cornelius A. Pratt) is a Houston-born rapper, entrepreneur, and cultural architect, and an Original Member of the South Park Coalition. His career spans three decades of independent music, business ventures, and blockchain innovation.",
  },
  {
    question: "What is Mr. CAP's real name?",
    answer: "Cornelius A. Pratt. Born in Houston, Texas and raised in South Park.",
  },
  {
    question: "Is Mr. CAP part of South Park Coalition?",
    answer:
      "Yes. Mr. CAP is an Original Member of the South Park Coalition (SPC), one of Houston's most influential independent hip-hop collectives.",
  },
  {
    question: "What is CAP Distributions?",
    answer:
      "CAP Distributions is a digital distribution company founded by Mr. CAP to help independent artists release music globally without sacrificing ownership.",
  },
  {
    question: "How can I book Mr. CAP?",
    answer:
      "Book Mr. CAP for concerts, festivals, features, speaking engagements, interviews, and creative or technology conversations at mrcap1.com/booking.",
  },
];

export const faqPage = (items: FaqItem[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});
