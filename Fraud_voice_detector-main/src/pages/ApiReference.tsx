import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DocumentationSection } from "@/components/DocumentationSection";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Code, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ApiReference = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <div className="max-w-3xl">
              <Badge 
                variant="outline" 
                className="mb-4 border-primary/30 bg-primary/5 text-primary"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                API Reference
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                VoiceGuard <span className="text-gradient">API Documentation</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Complete reference for integrating the VoiceGuard AI voice detection API 
                into your applications. Learn about endpoints, request formats, and response structures.
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <a href="#endpoint" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                  <Code className="h-4 w-4 text-primary" />
                  Endpoint
                </a>
                <a href="#request" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  Request Format
                </a>
                <a href="#response" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  Response Schema
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Overview</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="p-5 bg-card border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Simple Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Single POST endpoint with JSON request/response. No complex authentication flows.
                  </p>
                </Card>
                
                <Card className="p-5 bg-card border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Base64 Audio Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Send MP3 audio encoded in Base64. Maximum file size is 10MB per request.
                  </p>
                </Card>
                
                <Card className="p-5 bg-card border-border">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Detailed Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Get classification, confidence scores, and technical analysis details.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Documentation - Reuse existing component */}
        <div id="endpoint">
          <DocumentationSection />
        </div>

        {/* Additional Information */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Rate Limits & Usage</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold mb-3">Free Tier</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      1,000 API calls per month
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      10MB max file size
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      5 supported languages
                    </li>
                  </ul>
                </Card>
                
                <Card className="p-6 bg-card border-border">
                  <h3 className="font-semibold mb-3">Response Codes</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">200</Badge>
                      <span className="text-muted-foreground">Successful analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">400</Badge>
                      <span className="text-muted-foreground">Invalid request format</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">500</Badge>
                      <span className="text-muted-foreground">Server error</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApiReference;
