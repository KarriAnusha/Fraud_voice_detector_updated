import { useState, useEffect, forwardRef } from "react";
import { Key, Copy, Check, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ApiKey {
  id: string;
  key_name: string;
  project_name: string;
  api_key: string;
  created_at: string;
  is_active: boolean;
}

export const ApiKeysDialog = forwardRef<HTMLButtonElement>((_, ref) => {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching keys",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchKeys();
    }
  }, [open]);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyKey = async (apiKey: string, keyId: string) => {
    await navigator.clipboard.writeText(apiKey);
    setCopiedKey(keyId);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const deleteKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId);

      if (error) throw error;

      setKeys((prev) => prev.filter((k) => k.id !== keyId));
      toast({
        title: "Key deleted",
        description: "API key has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting key",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const maskKey = (key: string) => {
    const prefix = key.slice(0, 8);
    const suffix = key.slice(-4);
    return `${prefix}${"•".repeat(20)}${suffix}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button ref={ref} variant="ghost" size="sm" className="text-muted-foreground">
          <Key className="mr-2 h-4 w-4" />
          My Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Your API Keys</DialogTitle>
          <DialogDescription>
            Manage your generated API keys. Keep them secure.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : keys.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No API keys yet</p>
              <p className="text-sm">Create one using the "Get API Key" button</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{key.key_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {key.project_name} • Created {formatDate(key.created_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        key.is_active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {key.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono truncate">
                      {visibleKeys.has(key.id) ? key.api_key : maskKey(key.api_key)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyKey(key.api_key, key.id)}
                    >
                      {copiedKey === key.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

ApiKeysDialog.displayName = "ApiKeysDialog";
