import { ArrowUpRight, Search, Menu } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

import whiteHoodie from "@/assets/trap-university/white-hoodie.webp";
import leatherJacket from "@/assets/trap-university/leather-jacket.webp";
import backpack from "@/assets/trap-university/backpack.webp";
import croppedHoodie from "@/assets/trap-university/cropped-hoodie.webp";

const categories = [
  {
    title: "Apparel",
    image: whiteHoodie,
    href: "#products",
  },
  {
    title: "Outerwear",
    image: leatherJacket,
    href: "#products",
  },
  {
    title: "Accessories",
    image: backpack,
    href: "#products",
  },
  {
    title: "Limited",
    image: croppedHoodie,
    href: "#products",
  },
];

const navigation = [
  { name: "Home", href: "/" },
  { name: "Music", href: "/mr-cap-discography" },
  { name: "NFTs", href: "/nft-gallery" },
  { name: "About", href: "/who-is-mr-cap" },
];

export const MerchHero = () => {
  const brandColors = ["#D2347A", "#D9A441", "#6E30C9", "#EDE6DA"];
  const chromaItems: ChromaGridItem[] = categories.map((cat, i) => ({
    image: cat.image,
    title: cat.title,
    url: cat.href,
    borderColor: brandColors[i],
    gradient: `linear-gradient(${145 + i * 30}deg, ${brandColors[i]}, #110B18)`,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <div className="relative bg-secondary/30">
        {/* Navigation */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="text-xl font-bold tracking-tight">Mr. CAP_</Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              ))}
              <Button variant="ghost" size="icon" className="rounded-full"><Search className="h-4 w-4" /></Button>
              <CartDrawer />
            </nav>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <CartDrawer />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full"><Menu className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader className="text-left">
                    <SheetTitle><Link to="/" className="text-xl font-bold">Mr. CAP_</Link></SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navigation.map((item) => (
                      <Link key={item.name} to={item.href} className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <Separator className="my-6" />
                  <div className="flex flex-col gap-4">
                    <Button variant="ghost" className="justify-start gap-2"><Search className="h-4 w-4" />Search</Button>
                  </div>
                  <Separator className="my-6" />
                  <Button className="w-full gap-2">Log In<ArrowUpRight className="h-4 w-4" /></Button>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" className="rounded-full gap-2">
                Log In
                <span className="bg-foreground text-background rounded-full p-0.5"><ArrowUpRight className="h-3 w-3" /></span>
              </Button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="py-16 lg:py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
              <p className="catalog-stamp mb-4">Official Merchandise · Wreckless Entertainment</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.05] mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="block text-foreground"
                >
                  Wear the ISM.
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="block text-gradient-gold"
                >
                  Rep the Legacy.
                </motion.span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-muted-foreground max-w-xl text-lg"
              >
                Premium apparel and accessories. Limited drops from Mr. CAP's creative universe — Houston made, worldwide worn.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{ height: '420px', position: 'relative' }}>
        <ChromaGrid
          items={chromaItems}
          columns={4}
          radius={250}
        />
      </div>
    </div>
  );
};
