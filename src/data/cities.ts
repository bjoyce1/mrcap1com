export interface CityData {
  name: string;
  slug: string;
  state: string;
  stateAbbr: string;
  region: string;
  population?: string;
  isMetro?: boolean;
}

export const texasCities: CityData[] = [
  // Major Markets
  { name: "Houston", slug: "houston", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "2.3M", isMetro: true },
  { name: "Dallas", slug: "dallas", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "1.3M", isMetro: true },
  { name: "Fort Worth", slug: "fort-worth", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "960K", isMetro: true },
  { name: "San Antonio", slug: "san-antonio", state: "Texas", stateAbbr: "TX", region: "South Texas", population: "1.5M", isMetro: true },
  { name: "Austin", slug: "austin", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "1M", isMetro: true },
  { name: "El Paso", slug: "el-paso", state: "Texas", stateAbbr: "TX", region: "West Texas", population: "680K", isMetro: true },
  { name: "Arlington", slug: "arlington", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "400K", isMetro: true },
  { name: "Corpus Christi", slug: "corpus-christi", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "320K", isMetro: true },
  { name: "Plano", slug: "plano", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "290K", isMetro: true },
  { name: "Lubbock", slug: "lubbock", state: "Texas", stateAbbr: "TX", region: "West Texas", population: "260K", isMetro: true },
  
  // Secondary Markets
  { name: "Garland", slug: "garland", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "240K" },
  { name: "Frisco", slug: "frisco", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "220K" },
  { name: "McKinney", slug: "mckinney", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "200K" },
  { name: "Pasadena", slug: "pasadena", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "150K" },
  { name: "Killeen", slug: "killeen", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "150K" },
  { name: "Brownsville", slug: "brownsville", state: "Texas", stateAbbr: "TX", region: "Rio Grande Valley", population: "185K" },
  { name: "Mesquite", slug: "mesquite", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "140K" },
  { name: "McAllen", slug: "mcallen", state: "Texas", stateAbbr: "TX", region: "Rio Grande Valley", population: "145K" },
  { name: "Waco", slug: "waco", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "140K" },
  { name: "Carrollton", slug: "carrollton", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "135K" },
  { name: "Denton", slug: "denton", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "140K" },
  { name: "Midland", slug: "midland", state: "Texas", stateAbbr: "TX", region: "West Texas", population: "140K" },
  { name: "Abilene", slug: "abilene", state: "Texas", stateAbbr: "TX", region: "West Texas", population: "125K" },
  { name: "Beaumont", slug: "beaumont", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "115K" },
  { name: "Round Rock", slug: "round-rock", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "130K" },
  { name: "The Woodlands", slug: "the-woodlands", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "120K" },
  { name: "Sugar Land", slug: "sugar-land", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "110K" },
  { name: "College Station", slug: "college-station", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "120K" },
  { name: "Tyler", slug: "tyler", state: "Texas", stateAbbr: "TX", region: "East Texas", population: "105K" },
  { name: "Wichita Falls", slug: "wichita-falls", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "105K" },
  { name: "San Marcos", slug: "san-marcos", state: "Texas", stateAbbr: "TX", region: "Central Texas", population: "70K" },
  { name: "Galveston", slug: "galveston", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "55K" },
  { name: "Laredo", slug: "laredo", state: "Texas", stateAbbr: "TX", region: "South Texas", population: "260K" },
  { name: "Amarillo", slug: "amarillo", state: "Texas", stateAbbr: "TX", region: "Texas Panhandle", population: "200K" },
  { name: "Grand Prairie", slug: "grand-prairie", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "195K" },
  { name: "Odessa", slug: "odessa", state: "Texas", stateAbbr: "TX", region: "West Texas", population: "115K" },
  { name: "Lewisville", slug: "lewisville", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "110K" },
  { name: "Edinburg", slug: "edinburg", state: "Texas", stateAbbr: "TX", region: "Rio Grande Valley", population: "100K" },
  { name: "Pearland", slug: "pearland", state: "Texas", stateAbbr: "TX", region: "Gulf Coast", population: "125K" },
  { name: "Allen", slug: "allen", state: "Texas", stateAbbr: "TX", region: "North Texas", population: "105K" },
];

export const louisianaCities: CityData[] = [
  { name: "New Orleans", slug: "new-orleans", state: "Louisiana", stateAbbr: "LA", region: "Southeast Louisiana", population: "390K", isMetro: true },
  { name: "Baton Rouge", slug: "baton-rouge", state: "Louisiana", stateAbbr: "LA", region: "Capital Region", population: "225K", isMetro: true },
  { name: "Shreveport", slug: "shreveport", state: "Louisiana", stateAbbr: "LA", region: "Northwest Louisiana", population: "185K", isMetro: true },
  { name: "Lafayette", slug: "lafayette", state: "Louisiana", stateAbbr: "LA", region: "Acadiana", population: "125K", isMetro: true },
  { name: "Lake Charles", slug: "lake-charles", state: "Louisiana", stateAbbr: "LA", region: "Southwest Louisiana", population: "85K" },
  { name: "Kenner", slug: "kenner", state: "Louisiana", stateAbbr: "LA", region: "Southeast Louisiana", population: "65K" },
  { name: "Monroe", slug: "monroe", state: "Louisiana", stateAbbr: "LA", region: "Northeast Louisiana", population: "48K" },
  { name: "Alexandria", slug: "alexandria", state: "Louisiana", stateAbbr: "LA", region: "Central Louisiana", population: "45K" },
  { name: "Houma", slug: "houma", state: "Louisiana", stateAbbr: "LA", region: "Bayou Region", population: "33K" },
  { name: "Slidell", slug: "slidell", state: "Louisiana", stateAbbr: "LA", region: "Southeast Louisiana", population: "28K" },
  { name: "Bossier City", slug: "bossier-city", state: "Louisiana", stateAbbr: "LA", region: "Northwest Louisiana", population: "70K" },
];

export const allCities = [...texasCities, ...louisianaCities];

export const getCityBySlug = (slug: string): CityData | undefined => {
  return allCities.find(city => city.slug === slug);
};

export const getCitiesByState = (state: string): CityData[] => {
  return allCities.filter(city => city.state === state);
};

export const getMetroCities = (): CityData[] => {
  return allCities.filter(city => city.isMetro);
};
