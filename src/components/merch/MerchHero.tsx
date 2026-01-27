import { ArrowUpRight, Search, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
  { name: "Music", href: "/music" },
  { name: "NFTs", href: "/nft-gallery" },
  { name: "About", href: "/about" },
];

export const MerchHero = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <div className="relative bg-secondary/30">
        {/* Navigation */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold tracking-tight">
              Mr. CAP_
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      <Link to="/" className="text-xl font-bold">
                        Mr. CAP_
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                  <Separator className="my-6" />
                  <div className="flex flex-col gap-4">
                    <Button variant="ghost" className="justify-start gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                  <Separator className="my-6" />
                  <Button className="w-full gap-2">
                    Log In
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" className="rounded-full gap-2">
                Log In
                <span className="bg-foreground text-background rounded-full p-0.5">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </Button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="py-16 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Official Merchandise
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-muted-foreground">Curate your style</span>
                <br />
                <span className="text-foreground">with exclusive drops.</span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Premium quality apparel and accessories. Limited edition releases from Mr. CAP's creative universe.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <motion.a
            key={category.title}
            href={category.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "group relative aspect-square overflow-hidden cursor-pointer",
              "border-r border-b border-border last:border-r-0",
              "lg:[&:nth-child(4)]:border-r-0"
            )}
          >
            <div className="absolute inset-0 bg-secondary/50 group-hover:bg-secondary/30 transition-colors duration-300" />
            
            {/* Category Title */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-sm font-medium text-foreground">
                {category.title}
              </span>
            </div>

            {/* Arrow */}
            <div className="absolute top-4 right-4 z-10">
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>

            {/* Category Image */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
