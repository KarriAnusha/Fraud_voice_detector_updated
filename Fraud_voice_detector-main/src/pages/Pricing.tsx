import { useState, useEffect } from "react";
import { Check, Zap, Crown, Building2, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";

// Stripe Price IDs
const PRICE_IDS = {
  pro: "price_1SvkNK0dGVvha6yjjEL1H480",
  enterprise: "price_1SvkPt0dGVvha6yjlB4TYkd1",
};

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceId: string | null;
  tier: "free" | "pro" | "enterprise";
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  callsPerMonth: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "Perfect for testing and small projects",
    price: "$0",
    priceId: null,
    tier: "free",
    icon: <Zap className="h-6 w-6" />,
    callsPerMonth: "1,000",
    features: [
      "1,000 API calls per month",
      "Basic voice detection",
      "Community support",
      "Standard response time",
      "API documentation access",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Pro",
    description: "For growing businesses and teams",
    price: "$29",
    priceId: PRICE_IDS.pro,
    tier: "pro",
    icon: <Crown className="h-6 w-6" />,
    callsPerMonth: "10,000",
    features: [
      "10,000 API calls per month",
      "Advanced voice detection",
      "Priority email support",
      "Faster response time",
      "Advanced analytics dashboard",
      "Webhook integrations",
    ],
    highlighted: true,
    buttonText: "Subscribe to Pro",
  },
  {
    name: "Enterprise",
    description: "For large-scale deployments",
    price: "$99",
    priceId: PRICE_IDS.enterprise,
    tier: "enterprise",
    icon: <Building2 className="h-6 w-6" />,
    callsPerMonth: "100,000",
    features: [
      "100,000 API calls per month",
      "Premium voice detection models",
      "24/7 dedicated support",
      "Fastest response time",
      "Custom model training",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise deployment option",
    ],
    buttonText: "Subscribe to Enterprise",
  },
];

const Pricing = () => {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const { user, subscription, subscriptionLoading, checkSubscription } = useAuth();
  const [searchParams] = useSearchParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({
        title: "Payment successful!",
        description: "Your subscription is now active. Refreshing status...",
      });
      // Refresh subscription status after successful checkout
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    } else if (searchParams.get("canceled") === "true") {
      toast({
        title: "Payment canceled",
        description: "Your subscription was not processed.",
        variant: "destructive",
      });
    }
  }, [searchParams, checkSubscription]);

  const handleSubscribe = async (tier: PricingTier) => {
    if (!tier.priceId) {
      toast({
        title: "Welcome to Free tier!",
        description: "Create an API key to get started with 1,000 free calls per month.",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a paid plan.",
        variant: "destructive",
      });
      return;
    }

    // If already subscribed to this tier, open portal instead
    if (subscription.tier === tier.tier) {
      handleManageSubscription();
      return;
    }

    setLoadingTier(tier.name);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: tier.priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage your subscription.",
        variant: "destructive",
      });
      return;
    }

    setPortalLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Portal error:", error);
      toast({
        title: "Could not open portal",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const getButtonText = (tier: PricingTier) => {
    if (loadingTier === tier.name) return "Loading...";
    if (subscription.tier === tier.tier) return "Your Current Plan";
    if (subscription.subscribed && tier.tier === "free") return "Downgrade";
    return tier.buttonText;
  };

  const isCurrentPlan = (tier: PricingTier) => subscription.tier === tier.tier;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and scale as you grow.
              All plans include access to our voice detection API.
            </p>
          </div>

          {/* Subscription Status Banner */}
          {user && subscription.subscribed && (
            <div className="max-w-2xl mx-auto mb-10">
              <div className="flex items-center justify-between p-4 rounded-lg border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="capitalize">
                    {subscription.tier} Plan
                  </Badge>
                  {subscription.subscriptionEnd && (
                    <span className="text-sm text-muted-foreground">
                      Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => checkSubscription()}
                    disabled={subscriptionLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-1 ${subscriptionLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    {portalLoading ? "Loading..." : "Manage"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name}
                className={`relative flex flex-col transition-all duration-300 hover:shadow-lg ${
                  isCurrentPlan(tier)
                    ? "border-primary border-2 shadow-primary/20 shadow-lg"
                    : tier.highlighted 
                      ? "border-primary/50 shadow-primary/10 shadow-lg scale-105" 
                      : "border-border"
                }`}
              >
                {isCurrentPlan(tier) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Your Plan
                    </Badge>
                  </div>
                )}
                {!isCurrentPlan(tier) && tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary/80 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-3 rounded-lg w-fit mb-4 ${
                    isCurrentPlan(tier) || tier.highlighted 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== "$0" && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {tier.callsPerMonth} API calls/month
                    </p>
                  </div>
                  
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${isCurrentPlan(tier) ? "" : tier.highlighted ? "glow-primary" : ""}`}
                    variant={isCurrentPlan(tier) ? "secondary" : tier.highlighted ? "default" : "outline"}
                    onClick={() => handleSubscribe(tier)}
                    disabled={loadingTier === tier.name || (isCurrentPlan(tier) && !subscription.subscribed)}
                  >
                    {getButtonText(tier)}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Need a custom plan or have questions about our pricing? 
              Contact us at{" "}
              <a href="mailto:support@voiceguard.ai" className="text-primary hover:underline">
                support@voiceguard.ai
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
