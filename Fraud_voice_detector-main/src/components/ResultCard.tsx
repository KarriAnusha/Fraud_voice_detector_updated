import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { Bot, User, Clock, Brain, Languages } from "lucide-react";

interface AnalysisDetails {
  spectral_analysis: string;
  prosodic_patterns: string;
  temporal_consistency: string;
  acoustic_artifacts: string;
  morphing_indicators?: string;
}

interface DetectionResult {
  classification: "AI-generated" | "Human-generated" | "AI-morphed" | "Uncertain";
  confidence_score: number;
  explanation: string;
  language_detected?: string;
  morphing_suspected?: boolean;
  analysis_details: AnalysisDetails;
  processing_time_ms: number;
}

interface ResultCardProps {
  result: DetectionResult;
}

export const ResultCard = ({ result }: ResultCardProps) => {
  const isAI = result.classification === "AI-generated";
  const isMorphed = result.classification === "AI-morphed";
  const isHuman = result.classification === "Human-generated";
  const isUncertain = result.classification === "Uncertain";
  const confidencePercent = Math.round(result.confidence_score * 100);

  // Determine color scheme based on classification
  const getColorScheme = () => {
    if (isHuman) return { border: "border-success/50", bg: "bg-success/5", glow: "glow-success", text: "text-success", iconBg: "bg-success/20" };
    if (isUncertain) return { border: "border-blue-500/50", bg: "bg-blue-500/5", glow: "", text: "text-blue-500", iconBg: "bg-blue-500/20" };
    if (isMorphed) return { border: "border-orange-500/50", bg: "bg-orange-500/5", glow: "", text: "text-orange-500", iconBg: "bg-orange-500/20" };
    return { border: "border-warning/50", bg: "bg-warning/5", glow: "glow-warning", text: "text-warning", iconBg: "bg-warning/20" };
  };

  const colors = getColorScheme();

  return (
    <Card className={`p-6 border-2 transition-all animate-fade-in ${colors.border} ${colors.bg} ${colors.glow}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${colors.iconBg}`}>
            {isHuman ? (
              <User className={`h-6 w-6 ${colors.text}`} />
            ) : isUncertain ? (
              <Brain className={`h-6 w-6 ${colors.text}`} />
            ) : (
              <Bot className={`h-6 w-6 ${colors.text}`} />
            )}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${colors.text}`}>
              {result.classification}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{result.processing_time_ms}ms</span>
              {result.language_detected && (
                <>
                  <span className="mx-1">•</span>
                  <Languages className="h-3.5 w-3.5" />
                  <span className="capitalize">{result.language_detected}</span>
                </>
              )}
              {result.morphing_suspected && (
                <>
                  <span className="mx-1">•</span>
                  <Badge variant="outline" className="text-orange-500 border-orange-500/50 text-xs">
                    Morphing Detected
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Confidence Score */}
        <div className="text-right">
          <div className={`text-3xl font-bold ${colors.text}`}>
            {confidencePercent}%
          </div>
          <span className="text-sm text-muted-foreground">Confidence</span>
        </div>
      </div>

      {/* Waveform */}
      <div className="mb-6">
        <WaveformVisualizer variant={isHuman ? "success" : isUncertain ? "primary" : "warning"} />
      </div>

      {/* Explanation */}
      <div className="mb-6 p-4 rounded-lg bg-background/50 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Explanation</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.explanation}
        </p>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(result.analysis_details).map(([key, value]) => (
          <div 
            key={key} 
            className="p-3 rounded-lg bg-background/30 border border-border/50"
          >
            <span className="text-xs font-medium text-primary uppercase tracking-wide">
              {key.replace(/_/g, ' ')}
            </span>
            <p className="text-sm text-muted-foreground mt-1">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
