import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Send, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { trackBookingSubmit } from '@/components/GoogleAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Please enter a valid email'),
  phone: z.string().trim().max(20).optional(),
  booking_type: z.enum(['show', 'feature', 'interview', 'speaking', 'other']),
  city: z.string().trim().max(100).optional(),
  venue: z.string().trim().max(200).optional(),
  event_date: z.string().optional(),
  message: z.string().trim().max(1000).optional(),
});

type BookingType = 'show' | 'feature' | 'interview' | 'speaking' | 'other';

const steps = [
  { label: 'Contact', fields: ['name', 'email', 'phone'] },
  { label: 'Event', fields: ['booking_type', 'city', 'venue', 'event_date'] },
  { label: 'Details', fields: ['message'] },
];

const BookingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    booking_type: 'show' as BookingType,
    city: '',
    venue: '',
    event_date: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepFields = steps[step].fields;
    const partial: Record<string, unknown> = {};
    for (const f of stepFields) {
      partial[f] = (formData as Record<string, string>)[f];
    }

    // Only validate required fields per step
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.name || formData.name.trim().length < 2) newErrors.name = 'Name is required';
      if (!formData.email || !z.string().email().safeParse(formData.email).success) newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('booking_requests').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      booking_type: formData.booking_type,
      city: formData.city || null,
      venue: formData.venue || null,
      event_date: formData.event_date || null,
      message: formData.message || null,
    });

    if (error) {
      toast.error('Failed to submit request. Please try again.');
    } else {
      setIsSubmitted(true);
      toast.success('Booking request submitted!');
      trackBookingSubmit();
    }

    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-400/10 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="font-display text-2xl font-medium mb-2">Request Received</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for your inquiry. We'll get back to you within 24-48 hours.
        </p>
        <Button
          variant="fluxOutline"
          onClick={() => {
            setIsSubmitted(false);
            setCurrentStep(0);
            setFormData({
              name: '',
              email: '',
              phone: '',
              booking_type: 'show',
              city: '',
              venue: '',
              event_date: '',
              message: '',
            });
          }}
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-3 mb-2">
        {steps.map((step, i) => (
          <button
            key={step.label}
            type="button"
            onClick={() => { if (i < currentStep) setCurrentStep(i); }}
            className="flex items-center gap-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                i === currentStep
                  ? 'bg-primary text-primary-foreground scale-110'
                  : i < currentStep
                  ? 'bg-primary/30 text-foreground'
                  : 'bg-white/5 text-muted-foreground'
              }`}
            >
              {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-[2px] transition-colors ${i < currentStep ? 'bg-primary/50' : 'bg-white/10'}`} />
            )}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Step {currentStep + 1} of {steps.length}: <span className="text-foreground font-medium">{steps[currentStep].label}</span>
      </p>

      {/* Animated Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {currentStep === 0 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-secondary/50 border-white/10"
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-secondary/50 border-white/10"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="bg-secondary/50 border-white/10"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="booking_type" className="text-sm">
                  Request Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.booking_type}
                  onValueChange={(value) => handleChange('booking_type', value)}
                >
                  <SelectTrigger className="bg-secondary/50 border-white/10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">Live Show / Performance</SelectItem>
                    <SelectItem value="feature">Music Feature / Collaboration</SelectItem>
                    <SelectItem value="interview">Interview / Press</SelectItem>
                    <SelectItem value="speaking">Speaking Engagement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm">City / Location</Label>
                  <Input
                    id="city"
                    placeholder="Houston, TX"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="bg-secondary/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-sm">Venue / Event Name</Label>
                  <Input
                    id="venue"
                    placeholder="Venue or event name"
                    value={formData.venue}
                    onChange={(e) => handleChange('venue', e.target.value)}
                    className="bg-secondary/50 border-white/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date" className="text-sm">Proposed Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleChange('event_date', e.target.value)}
                  className="bg-secondary/50 border-white/10"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm">Message / Details</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your event, budget, and any other details..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  className="bg-secondary/50 border-white/10 resize-none"
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button type="button" variant="flux" onClick={goNext} className="gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" variant="flux" disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
