import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

// Import product images
import whiteHoodie from "@/assets/trap-university/white-hoodie.jpg";
import leatherJacket from "@/assets/trap-university/leather-jacket.jpg";
import slides from "@/assets/trap-university/slides.jpg";
import croppedHoodie from "@/assets/trap-university/cropped-hoodie.jpg";
import backpack from "@/assets/trap-university/backpack.jpg";
interface PlaceholderItem {
  id: number;
  title: string;
  price: string;
  image?: string;
}
const placeholderItems: PlaceholderItem[] = [{
  id: 1,
  title: "White Hoodie",
  price: "TBD",
  image: whiteHoodie
}, {
  id: 2,
  title: "Leather Bomber Jacket",
  price: "TBD",
  image: leatherJacket
}, {
  id: 3,
  title: "Slides",
  price: "TBD",
  image: slides
}, {
  id: 4,
  title: "Women's Cropped Hoodie",
  price: "TBD",
  image: croppedHoodie
}, {
  id: 5,
  title: "All-Over Print Backpack",
  price: "TBD",
  image: backpack
}, {
  id: 6,
  title: "Trap University Shorts",
  price: "TBD"
}, {
  id: 7,
  title: "Trap University Sweatpants",
  price: "TBD"
}, {
  id: 8,
  title: "Trap University Tank Top",
  price: "TBD"
}, {
  id: 9,
  title: "Trap University Beanie",
  price: "TBD"
}, {
  id: 10,
  title: "Trap University Cap",
  price: "TBD"
}];
export const TrapUniversityCollection = () => {
  return <section className="py-16 bg-secondary/20">
      
    </section>;
};