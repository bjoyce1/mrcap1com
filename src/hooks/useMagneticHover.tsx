import { useEffect, useRef } from "react";
import gsap from "gsap";

export const useMagneticHover = (strength: number = 0.3) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
};

// Component wrapper for magnetic effect
export const MagneticWrapper = ({ 
  children, 
  strength = 0.3,
  className = "" 
}: { 
  children: React.ReactNode; 
  strength?: number;
  className?: string;
}) => {
  const magneticRef = useMagneticHover(strength);
  
  return (
    <div ref={magneticRef as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
};
