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

const categories = [
  {
    title: "Apparel",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    href: "#products",
  },
  {
    title: "Headwear",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    href: "#products",
  },
  {
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    href: "#products",
  },
  {
    title: "Limited",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop",
    href: "#products",
  },
];

const navigation = [
  { name: "Home", href: "/" },
  { name: "Music", href: "/discography" },
  { name: "NFTs", href: "/nft-gallery" },
  { name: "About", href: "/about" },
];

export const MerchHero = () => {
  const chromaItems: ChromaGridItem[] = categories.map((cat, i) => ({
    image: cat.image,
    title: cat.title,
    url: cat.href,
    borderColor: ["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6"][i],
    gradient: `linear-gradient(${145 + i * 30}deg, ${["#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6"][i]}, #000)`,
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
              <p className="text-sm font-medium text-muted-foreground mb-4">Official Merchandise</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-muted-foreground">Curate your style</span><br />
                <span className="text-foreground">with exclusive drops.</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">Premium quality apparel and accessories. Limited edition releases from Mr. CAP's creative universe.</p>
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
