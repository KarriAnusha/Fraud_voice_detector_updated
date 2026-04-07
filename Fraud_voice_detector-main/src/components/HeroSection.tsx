import { Shield, ArrowRight, Mic, AudioWaveform } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative py-24 lg:py-36 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-soundwave" />
      <div className="absolute inset-0 bg-dots-tech opacity-50" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge 
            variant="outline" 
            className="mb-6 border-primary/30 bg-primary/5 text-primary px-4 py-2 text-sm font-medium animate-fade-in hover:bg-primary/10 transition-colors cursor-default"
          >
            <AudioWaveform className="mr-2 h-4 w-4 animate-pulse-soft" />
            Voice Detector
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-slide-up">
            Detect AI-Generated Voices
            <span className="block text-gradient mt-2">With Precision</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Enterprise-grade API for identifying synthetic and AI-morphed voices across 
            <span className="text-foreground font-semibold"> Tamil, English, Hindi, Malayalam, </span> 
            and <span className="text-foreground font-semibold">Telugu</span>. 
            Protect against voice fraud and deepfakes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="shadow-glow-primary hover:shadow-lg transition-all text-base px-8 h-12 group" asChild>
              <a href="#playground">
                Try the Playground
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 h-12 hover-lift" asChild>
              <Link to="/api-reference">
                View Documentation
              </Link>
            </Button>
          </div>

          {/* Waveform Visualization */}
          <div className="max-w-xl mx-auto p-8 rounded-2xl glass border-gradient animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mic className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Live Audio Analysis</span>
            </div>
            <WaveformVisualizer isAnimating />
            <div className="mt-6 flex items-center justify-center gap-8 text-sm">
              <span className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">Human Voice</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse" />
                <span className="text-muted-foreground">AI Generated</span>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center p-6 rounded-xl glass hover-lift group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">5</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Languages</div>
            </div>
            <div className="text-center p-6 rounded-xl glass hover-lift group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">~10s</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Latency</div>
            </div>
            <div className="text-center p-6 rounded-xl glass hover-lift group cursor-default">
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary group-hover:scale-110 transition-transform">99.2%</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
