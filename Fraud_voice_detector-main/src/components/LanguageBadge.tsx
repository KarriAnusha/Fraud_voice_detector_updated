import { Badge } from "@/components/ui/badge";

interface LanguageBadgeProps {
  language: string;
  isActive?: boolean;
  onClick?: () => void;
}

const languageColors: Record<string, string> = {
  tamil: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  english: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  hindi: "bg-green-500/20 text-green-400 border-green-500/30",
  malayalam: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  telugu: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export const LanguageBadge = ({ language, isActive, onClick }: LanguageBadgeProps) => {
  const colorClass = languageColors[language.toLowerCase()] || "bg-muted text-muted-foreground";
  
  return (
    <Badge
      variant="outline"
      className={`cursor-pointer transition-all capitalize ${colorClass} ${
        isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
      }`}
      onClick={onClick}
    >
      {language}
    </Badge>
  );
};
