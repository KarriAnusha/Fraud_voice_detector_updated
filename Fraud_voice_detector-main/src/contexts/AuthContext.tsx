import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Product ID to tier mapping
const PRODUCT_TIERS: Record<string, string> = {
  "prod_TtXSM8Apm24wa7": "pro",
  "prod_TtXULY0WWcu7qd": "enterprise",
};

interface SubscriptionInfo {
  subscribed: boolean;
  productId: string | null;
  priceId: string | null;
  tier: "free" | "pro" | "enterprise";
  subscriptionEnd: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionInfo;
  subscriptionLoading: boolean;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultSubscription: SubscriptionInfo = {
  subscribed: false,
  productId: null,
  priceId: null,
  tier: "free",
  subscriptionEnd: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(defaultSubscription);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const checkSubscription = async () => {
    if (!session) {
      setSubscription(defaultSubscription);
      return;
    }

    setSubscriptionLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Error checking subscription:", error);
        return;
      }

      if (data) {
        const tier = data.product_id 
          ? (PRODUCT_TIERS[data.product_id] as "pro" | "enterprise") || "free"
          : "free";

        setSubscription({
          subscribed: data.subscribed || false,
          productId: data.product_id || null,
          priceId: data.price_id || null,
          tier,
          subscriptionEnd: data.subscription_end || null,
        });
      }
    } catch (err) {
      console.error("Failed to check subscription:", err);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription(defaultSubscription);
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer subscription check to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            checkSubscription();
          }, 0);
        } else {
          setSubscription(defaultSubscription);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkSubscription();
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Auto-refresh subscription every minute
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        subscriptionLoading,
        checkSubscription,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
