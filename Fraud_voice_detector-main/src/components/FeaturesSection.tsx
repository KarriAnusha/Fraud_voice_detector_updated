import { 
  Languages, 
  Shield, 
  Zap, 
  FileJson, 
  Brain, 
  Lock,
  Fingerprint,
  Waves
} from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Languages,
    title: "Multi-Language Support",
    description: "Accurate detection across Tamil, English, Hindi, Malayalam, and Telugu with dialect awareness.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced neural network models analyze spectral patterns, prosody, and acoustic artifacts.",
  },
  {
    icon: Zap,
    title: "Real-Time Detection",
    description: "Sub-2 second processing time for instant voice authentication decisions.",
  },
  {
    icon: FileJson,
    title: "RESTful API",
    description: "Simple JSON-based API with Base64 audio input and structured response output.",
  },
  {
    icon: Shield,
    title: "Explainable Results",
    description: "Detailed explanations and confidence scores for every detection result.",
  },
  {
    icon: Fingerprint,
    title: "Acoustic Fingerprinting",
    description: "Deep analysis of voice characteristics including harmonics and temporal patterns.",
  },
  {
    icon: Waves,
    title: "Spectral Analysis",
    description: "Advanced frequency domain analysis to detect synthetic voice artifacts.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Production-ready with authentication, rate limiting, and audit logging.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative bg-muted/30">
      <div className="absolute inset-0 bg-circuit opacity-50" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Enterprise-Grade <span className="text-gradient">Voice Detection</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Built for production environments with comprehensive analysis capabilities 
            and seamless API integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="p-6 bg-card border hover-lift group animate-fade-in cursor-default overflow-hidden relative"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-primary group-hover:animate-pulse" />
                </div>
                <h3 className="font-semibold mb-2 text-base group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
