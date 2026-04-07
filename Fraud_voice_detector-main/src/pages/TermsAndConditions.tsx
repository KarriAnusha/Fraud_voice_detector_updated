import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last updated: January 31, 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the VoiceGuard API service ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                VoiceGuard provides an AI-powered voice detection API that analyzes audio content to determine whether it contains human or AI-generated speech. The Service is provided on an "as is" and "as available" basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. API Usage</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When using our API, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the API only for lawful purposes</li>
                <li>Not exceed your plan's API call limits</li>
                <li>Keep your API keys secure and confidential</li>
                <li>Not share or resell access to the API without authorization</li>
                <li>Not attempt to reverse engineer or exploit the API</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Account Registration</h2>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Subscription and Payments</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Paid subscriptions are billed monthly. By subscribing to a paid plan, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide accurate billing information</li>
                <li>Pay all fees associated with your chosen plan</li>
                <li>Accept that subscriptions auto-renew unless cancelled</li>
                <li>Understand that refunds are handled on a case-by-case basis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service, including its original content, features, and functionality, is owned by VoiceGuard and is protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                VoiceGuard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. The accuracy of voice detection results is not guaranteed and should not be the sole basis for critical decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@voiceguard.ai" className="text-primary hover:underline">
                  legal@voiceguard.ai
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
