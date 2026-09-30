/** Flyers from the ogpointblank.com/events archive. Inclusion requires an explicit Mr. CAP credit on the flyer or event record. Dates never exceed source precision. */
export interface LiveHistoryEvent {
  title: string;
  date?: string;
  dateLabel: string;
  city: string;
  state: string;
  venue?: string;
  context: string;
  flyer: string;
  source: string;
}

export const liveHistory: LiveHistoryEvent[] = [
  {
    title: "Point Blank — The Celebration!", date: "2023-11-11", dateLabel: "November 11, 2023",
    city: "Houston", state: "TX", venue: "Cooking With Flavour",
    context: "Mr. CAP listed as a special invited guest alongside K-Rino and Klondike Kat.",
    flyer: "/images/live/point-blank-celebration-houston-2023.jpg",
    source: "https://www.ogpointblank.com/event-details/pointblank-the-celebration",
  },
  {
    title: "SPC Concert Series — Westminster", date: "2020-04-24", dateLabel: "April 24, 2020",
    city: "Westminster", state: "CO", venue: "Sportswatch Bar and Grill",
    context: "Flyer lineup: K-Rino, Point Blank, Mr. CAP, Klondike Kat and The Terrorists.",
    flyer: "/images/live/spc-concert-westminster-2020.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Wizard & the Blanksta — San Antonio", date: "2020-03-08", dateLabel: "March 8, 2020",
    city: "San Antonio", state: "TX", venue: "Tequilas Sports Bar",
    context: "Mr. CAP pictured and named on the concert-series flyer with K-Rino and Point Blank.",
    flyer: "/images/live/spc-wizard-blanksta-san-antonio-2020.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Point Blank Birthday Bash", date: "2019-11-23", dateLabel: "November 23, 2019",
    city: "Houston", state: "TX", venue: "18307 Egret Bay Blvd",
    context: "Mr. CAP named in the South Park Coalition lineup with K-Rino, Big Pokey and more.",
    flyer: "/images/live/point-blank-birthday-houston-2019.png", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Point Blank Birthday Bash", date: "2018-11-24", dateLabel: "November 24, 2018",
    city: "Houston", state: "TX", venue: "Houston Underground",
    context: "Mr. CAP listed among the special guest performers on the flyer.",
    flyer: "/images/live/point-blank-birthday-houston-2018.png", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Do or Die — Still Poppin' Tour", date: "2018-01-12", dateLabel: "January 12, 2018",
    city: "Austin", state: "TX", venue: "Elysium",
    context: "Mr. CAP billed to perform live with K-Rino, Point Blank, Sniper and Statik-G.",
    flyer: "/images/live/spc-do-or-die-austin-2018.png", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "South Park Coalition — 30 Year Anniversary", date: "2017-07-29", dateLabel: "July 29, 2017",
    city: "Houston", state: "TX", venue: "Warehouse Live",
    context: "Mr. CAP named among the featured artists on the anniversary concert flyer.",
    flyer: "/images/live/spc-30th-anniversary-houston-2017.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "K-Rino & Point Blank — Warehouse Live", date: "2015-09-10", dateLabel: "September 10, 2015",
    city: "Houston", state: "TX", venue: "Warehouse Live",
    context: "Mr. CAP named as host on the album-release concert flyer.",
    flyer: "/images/live/k-rino-point-blank-houston-2015.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "South Park Coalition — 35th Anniversary", dateLabel: "Date unconfirmed",
    city: "Houston", state: "TX", venue: "18307 Egret Bay Blvd",
    context: "Mr. CAP named in the flyer lineup; the flyer gives September 10 but no year.",
    flyer: "/images/live/spc-35th-anniversary-houston.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Houston Underground Hoodfest", dateLabel: "Date unconfirmed",
    city: "Houston", state: "TX", venue: "Houston Underground",
    context: "Mr. CAP listed on the flyer with Point Blank, Klondike Kat and others; September 8, year unverified.",
    flyer: "/images/live/houston-underground-hoodfest.png", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "SPC Smokefest 420", dateLabel: "Date unconfirmed",
    city: "Colorado Springs", state: "CO", venue: "Royal Castle",
    context: "Mr. CAP billed on the flyer alongside Point Blank and Klondike Kat; April 20, year unverified.",
    flyer: "/images/live/spc-smokefest-colorado-springs.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "SPC 30th Anniversary After Party", dateLabel: "Date unconfirmed",
    city: "Houston", state: "TX", venue: "The Wash Cafe",
    context: "Mr. CAP named as a special guest on the after-party flyer.",
    flyer: "/images/live/spc-30th-after-party-houston.jpg", source: "https://www.ogpointblank.com/events",
  },
  {
    title: "Point Blank & K-Rino — Frank's Birthday Bash", dateLabel: "Date unconfirmed",
    city: "Corpus Christi", state: "TX", venue: "Aria Sky Terrace & Lounge",
    context: "Mr. CAP named as host on the concert flyer; December 17, year unverified.",
    flyer: "/images/live/point-blank-k-rino-corpus-christi.jpg", source: "https://www.ogpointblank.com/events",
  },
];