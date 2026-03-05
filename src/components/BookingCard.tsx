import { Calendar, Mic2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

interface BookingCardProps {
  variant?: "default" | "compact";
}

const bookingTypes = [
  { icon: Mic2, label: "Live Shows & Festivals", borderColor: "hsl(var(--primary))", gradient: "linear-gradient(145deg, hsl(var(--primary) / 0.12), hsl(var(--background)))" },
  { icon: MessageSquare, label: "Speaking & Panels", borderColor: "hsl(var(--cap-gold))", gradient: "linear-gradient(180deg, hsl(var(--cap-gold) / 0.12), hsl(var(--background)))" },
  { icon: Calendar, label: "Media & Interviews", borderColor: "hsl(var(--primary))", gradient: "linear-gradient(210deg, hsl(var(--primary) / 0.12), hsl(var(--background)))" },
];

const BookingCard = ({ variant = "default" }: BookingCardProps) => {
  if (variant === "compact") {
    return (
      <div className="bg-card/50 border border-border/50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-display font-bold">Book Mr. CAP</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Available for shows, speaking engagements, and media appearances.
          </p>
        </div>
        <Button variant="flux" asChild className="shrink-0">
          <a href="https://bookspc.com/artists/mr-cap" target="_blank" rel="noopener noreferrer">Book Now</a>
        </Button>
      </div>
    );
  }

  const chromaItems: ChromaGridItem[] = bookingTypes.map((type) => ({
    title: type.label,
    borderColor: type.borderColor,
    gradient: type.gradient,
    icon: type.icon,
  }));

  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-8">
      <h3 className="text-2xl font-display font-bold mb-2">Book Mr. CAP</h3>
      <p className="text-muted-foreground mb-6">
        Available for live performances, speaking engagements, media interviews, and special events across Texas and beyond.
      </p>
      <div style={{ position: 'relative', minHeight: '80px' }}>
        <ChromaGrid
          items={chromaItems}
          columns={3}
          radius={200}
          damping={0.4}
          fadeOut={0.5}
          renderCard={(item) => {
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            return (
              <div className="flex items-center gap-3 p-3">
                <Icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground">{item.title}</span>
              </div>
            );
          }}
        />
      </div>
      <Button variant="flux" asChild className="w-full sm:w-auto mt-6">
        <a href="https://bookspc.com/artists/mr-cap" target="_blank" rel="noopener noreferrer">Request Booking</a>
      </Button>
    </div>
  );
};

export default BookingCard;
