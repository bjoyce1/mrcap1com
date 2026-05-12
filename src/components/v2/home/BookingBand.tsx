import Reveal from "@/components/v2/Reveal";
import MagneticButton from "@/components/v2/MagneticButton";

/** Edge-to-edge cinematic CTA band — booking conversion. */
export default function BookingBand() {
  return (
    <section className="relative v2-surface-2 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 70% 50%, hsl(var(--v2-accent) / 0.5) 0%, transparent 60%)",
        }}
      />
      <div className="relative px-6 md:px-12 lg:px-20 py-32 md:py-48 max-w-5xl">
        <Reveal>
          <p className="v2-eyebrow mb-6">Booking</p>
          <h2 className="v2-display text-v2-ink text-[clamp(2.25rem,6vw,5.5rem)] max-w-[16ch]">
            Bring the <em className="v2-display-italic">South Park</em> sound to your stage.
          </h2>
          <p className="v2-body mt-8 max-w-xl text-base md:text-lg">
            Festivals, concerts, speaking, features. Houston-based, available worldwide.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <MagneticButton variant="primary" href="/booking">Request booking</MagneticButton>
            <MagneticButton variant="outline" href="/opk">Press kit</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
