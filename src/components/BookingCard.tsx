import { Link } from "react-router-dom";
import { Calendar, Mic2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  variant?: "default" | "compact";
}

const bookingTypes = [
  { icon: Mic2, label: "Live Shows & Festivals" },
  { icon: MessageSquare, label: "Speaking & Panels" },
  { icon: Calendar, label: "Media & Interviews" },
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
          <Link to="/booking">Book Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-8">
      <h3 className="text-2xl font-display font-bold mb-2">Book Mr. CAP</h3>
      <p className="text-muted-foreground mb-6">
        Available for live performances, speaking engagements, media interviews, and special events across Texas and beyond.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {bookingTypes.map((type) => (
          <div key={type.label} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
            <type.icon className="w-5 h-5 text-primary shrink-0" />
            <span className="text-sm font-medium">{type.label}</span>
          </div>
        ))}
      </div>
      <Button variant="flux" asChild className="w-full sm:w-auto">
        <Link to="/booking">Request Booking</Link>
      </Button>
    </div>
  );
};

export default BookingCard;
