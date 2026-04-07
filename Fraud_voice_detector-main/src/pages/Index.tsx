import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { APIPlayground } from "@/components/APIPlayground";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        
        {/* API Playground Section */}
        <section id="playground" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Interactive <span className="text-gradient">API Playground</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Test the voice detection API in real-time. Upload an audio file or 
                paste Base64-encoded audio to see the analysis results.
              </p>
            </div>
            
            <APIPlayground />
          </div>
        </section>

        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
