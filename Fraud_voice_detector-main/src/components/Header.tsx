import { useState, useCallback } from "react";
import { Shield, Copy, Check, Eye, EyeOff, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ApiKeysDialog } from "@/components/ApiKeysDialog";

const generateApiKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const prefix = 'vg_live_';
  let key = prefix;
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const Header = () => {
  const [keyName, setKeyName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => {
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.slice(1);
    }
    return location.pathname === path;
  };

  const handleHashNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // Already on home page, just scroll to section
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${hash}`);
      }
    } else {
      // Navigate to home page first, then scroll
      navigate('/');
      // Use setTimeout to ensure DOM is ready after navigation
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          window.history.pushState(null, '', `/#${hash}`);
        }
      }, 100);
    }
  }, [location.pathname, navigate]);

  const handleAuth = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword,
        });
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You're now signed in.",
        });
        setAuthDialogOpen(false);
      }
      setAuthEmail("");
      setAuthPassword("");
    } catch (error: any) {
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
  };

  const handleCreateKey = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an API key.",
        variant: "destructive",
      });
      setDialogOpen(false);
      setAuthDialogOpen(true);
      return;
    }

    if (!keyName.trim()) {
      toast({
        title: "Key name required",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter the project name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newApiKey = generateApiKey();
      
      const { error } = await supabase
        .from('api_keys')
        .insert({
          key_name: keyName.trim(),
          project_name: projectName.trim(),
          api_key: newApiKey,
          user_id: user.id,
        });

      if (error) throw error;

      setGeneratedKey(newApiKey);
      setShowKey(true);
      
      toast({
        title: "API Key Created!",
        description: "Your API key has been generated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating API key",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "API key copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setKeyName("");
    setProjectName("");
    setGeneratedKey(null);
    setCopied(false);
    setShowKey(false);
  };

  const maskKey = (key: string) => {
    const prefix = key.slice(0, 8);
    const suffix = key.slice(-4);
    return `${prefix}${'•'.repeat(24)}${suffix}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient">VoiceGuard</h1>
              <p className="text-xs text-muted-foreground">AI Voice Detection</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="/#features" 
              onClick={(e) => handleHashNavigation(e, 'features')}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive('/#features') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Features
            </a>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive('/pricing') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Pricing
            </Link>
            <a 
              href="/#playground" 
              onClick={(e) => handleHashNavigation(e, 'playground')}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive('/#playground') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              Playground
            </a>
            <Link 
              to="/api-reference" 
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isActive('/api-reference') 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              API Docs
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {user ? (
              <>
                <ApiKeysDialog />
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
                    <DialogDescription>
                      {isSignUp 
                        ? "Create an account to manage your API keys."
                        : "Sign in to create and manage your API keys."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="authEmail">Email</Label>
                      <Input
                        id="authEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="authPassword">Password</Label>
                      <Input
                        id="authPassword"
                        type="password"
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                      />
                    </div>
                    <Button onClick={handleAuth} disabled={authLoading} className="mt-2">
                      {authLoading ? "Please wait..." : (isSignUp ? "Sign Up" : "Sign In")}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                      <button 
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => setIsSignUp(!isSignUp)}
                      >
                        {isSignUp ? "Sign in" : "Sign up"}
                      </button>
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Dialog open={dialogOpen} onOpenChange={(open) => open ? setDialogOpen(true) : handleCloseDialog()}>
              <DialogTrigger asChild>
                <Button size="sm" className="shadow-glow-primary">
                  Get API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {generatedKey ? "Your API Key" : "Create API Key"}
                  </DialogTitle>
                  <DialogDescription>
                    {generatedKey 
                      ? "Save this key securely. You won't be able to see it again."
                      : "Generate an API key to integrate VoiceGuard into your project."
                    }
                  </DialogDescription>
                </DialogHeader>
                
                {!generatedKey ? (
                  <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        type="text"
                        placeholder="e.g., Production Key, Development Key"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        A friendly name to identify this key
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input
                        id="projectName"
                        type="text"
                        placeholder="e.g., My Voice App, Audio Analyzer"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateKey()}
                      />
                      <p className="text-xs text-muted-foreground">
                        The project where you'll use this API key
                      </p>
                    </div>
                    
                    <Button onClick={handleCreateKey} disabled={isSubmitting} className="mt-2">
                      {isSubmitting ? "Creating..." : "Create API Key"}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      Free tier includes 1,000 API calls per month.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Your API Key</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                          {showKey ? generatedKey : maskKey(generatedKey)}
                        </div>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleCopyKey}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-xs text-destructive">
                        ⚠️ Make sure to copy your API key now. You won't be able to see it again!
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Key Name:</span>
                        <p className="font-medium">{keyName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Project:</span>
                        <p className="font-medium">{projectName}</p>
                      </div>
                    </div>
                    
                    <Button onClick={handleCloseDialog} className="mt-2">
                      Done
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
};
