import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Security",
    company: "FinSecure Bank",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "VoiceGuard has been instrumental in preventing voice-based fraud attempts. We've blocked over 200 synthetic voice attacks in the first month alone.",
  },
  {
    name: "Michael Rodriguez",
    role: "CTO",
    company: "TeleHealth Plus",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The multi-language support is exceptional. Our patients across India feel secure knowing their voice authentication is protected.",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    company: "CallCenter Pro",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Integration took less than a day. The API is clean, documentation is excellent, and the detection accuracy has exceeded our expectations.",
  },
  {
    name: "David Kim",
    role: "Security Architect",
    company: "SecureVoice Inc",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "We evaluated 5 different voice detection APIs. VoiceGuard was the only one that could reliably detect AI-cloned voices with 98%+ accuracy.",
  },
  {
    name: "Emily Watson",
    role: "VP Engineering",
    company: "AuthentiCall",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The real-time detection is a game-changer. Sub-2 second response times mean we can authenticate calls without any noticeable delay.",
  },
  {
    name: "Rajesh Patel",
    role: "Director of IT",
    company: "Mumbai Insurance Co",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Tamil and Hindi detection works flawlessly. Our regional customers are protected just as well as our English-speaking clients.",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-warning text-warning" : "text-muted"
        }`}
      />
    ))}
  </div>
);

export const TestimonialsSection = () => {
  return (
    <section className="py-24 relative bg-background">
      <div className="absolute inset-0 bg-dots-tech opacity-30" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <span className="text-sm font-medium text-warning">Trusted by 500+ Companies</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            What Our <span className="text-gradient">Customers Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Security teams worldwide trust VoiceGuard to protect against synthetic voice fraud.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="p-6 bg-card border hover-lift group animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <StarRating rating={testimonial.rating} />
                
                <p className="mt-4 text-muted-foreground leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
                
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-gradient">99.2%</p>
            <p className="text-sm text-muted-foreground">Detection Accuracy</p>
          </div>
          <div className="h-12 w-px bg-border hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-gradient">500+</p>
            <p className="text-sm text-muted-foreground">Enterprise Clients</p>
          </div>
          <div className="h-12 w-px bg-border hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-gradient">10M+</p>
            <p className="text-sm text-muted-foreground">Voices Analyzed</p>
          </div>
          <div className="h-12 w-px bg-border hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-bold text-gradient">&lt;2s</p>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </div>
        </div>
      </div>
    </section>
  );
};
