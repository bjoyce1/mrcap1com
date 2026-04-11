import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Home, Music, CalendarCheck, FileText, ArrowRight } from "lucide-react";

const recoveryLinks = [
  { to: "/", label: "Home", icon: Home, description: "Back to the main page" },
  { to: "/discography", label: "Music", icon: Music, description: "Explore the catalog" },
  { to: "/booking", label: "Booking", icon: CalendarCheck, description: "Submit an inquiry" },
  { to: "/press", label: "Press & EPK", icon: FileText, description: "Media resources" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Mr. CAP</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <p className="text-primary font-mono text-sm tracking-widest mb-4">404</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Page Not Found</h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-md mx-auto">
              The page you're looking for doesn't exist or has moved. Try one of these instead:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {recoveryLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-start gap-4 bg-card/40 border border-border/30 rounded-2xl p-5 hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <link.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground flex items-center gap-1">
                      {link.label}
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
