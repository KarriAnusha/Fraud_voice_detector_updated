import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { ResultCard } from "./ResultCard";
import { CodeBlock } from "./CodeBlock";
import { Upload, Play, Loader2, FileAudio, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DetectionResult {
  classification: "AI-generated" | "Human-generated" | "AI-morphed";
  confidence_score: number;
  explanation: string;
  language_detected?: string;
  morphing_suspected?: boolean;
  analysis_details: {
    spectral_analysis: string;
    prosodic_patterns: string;
    temporal_consistency: string;
    acoustic_artifacts: string;
    morphing_indicators?: string;
  };
  processing_time_ms: number;
}

export const APIPlayground = () => {
  const [audioBase64, setAudioBase64] = useState("");
  const [showRequestResponse, setShowRequestResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3 recommended)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setAudioBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFileName(null);
    setAudioBase64("");
    setResult(null);
    setShowRequestResponse(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDetect = async () => {
    if (!audioBase64) {
      toast({
        title: "No audio provided",
        description: "Please upload an audio file or paste Base64 data",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setShowRequestResponse(false);

    try {
      // Use Supabase client to call edge function - handles auth automatically
      const { data, error: invokeError } = await supabase.functions.invoke("detect-voice", {
        body: { audio: audioBase64 },
      });

      if (invokeError) {
        throw new Error(invokeError.message || "Detection failed");
      }

      if (data?.error) {
        throw new Error(data.message || data.error || "Detection failed");
      }

      setResult(data);
      setShowRequestResponse(true);
    } catch (error) {
      console.error("Detection error:", error);
      toast({
        title: "Detection failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestExample = JSON.stringify({
    audio: "<base64-encoded-mp3>"
  }, null, 2) + "\n// Language is auto-detected";

  const responseExample = result 
    ? JSON.stringify(result, null, 2)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <Card className="p-6 border-border bg-card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileAudio className="h-5 w-5 text-primary" />
          Input
        </h3>

        {/* File Upload */}
        <div className="mb-6">
          <Label className="text-sm mb-2 block">Audio File</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {fileName ? (
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
              <div className="flex items-center gap-3">
                <FileAudio className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{fileName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="w-full h-24 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 hover:border-primary/50 focus:bg-primary/10 focus:border-primary/50 active:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Upload MP3 file (max 10MB)
              </span>
            </button>
          )}
        </div>

        {/* Base64 Input */}
        <div className="mb-6">
          <Label className="text-sm mb-2 block">Or paste Base64-encoded audio</Label>
          <Textarea
            placeholder="Paste Base64-encoded MP3 data here..."
            value={audioBase64}
            onChange={(e) => {
              setAudioBase64(e.target.value);
              setFileName(null);
            }}
            className="font-mono text-xs h-32 bg-secondary/30"
          />
        </div>

        {/* Auto-detect info */}
        <div className="mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-medium">Auto-detect:</span> Language is automatically detected from the audio sample.
          </p>
        </div>

        {/* Waveform Preview */}
        <div className="mb-6 p-4 rounded-lg bg-secondary/30 border border-border">
          <WaveformVisualizer isAnimating={isLoading} />
        </div>

        {/* Detect Button */}
        <Button
          onClick={handleDetect}
          disabled={!audioBase64 || isLoading}
          className="w-full glow-primary"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Voice...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Detect Voice
            </>
          )}
        </Button>
      </Card>

      {/* Output Panel */}
      <div className="space-y-6">
        {/* Result */}
        {result && <ResultCard result={result} />}

        {/* Code Examples - only show after running a test */}
        {showRequestResponse && (
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">Request / Response</h3>
            <div className="space-y-4">
              <CodeBlock 
                code={requestExample} 
                language="json" 
                title="Request Body" 
              />
              {responseExample && (
                <CodeBlock 
                  code={responseExample} 
                  language="json" 
                  title="Response" 
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
