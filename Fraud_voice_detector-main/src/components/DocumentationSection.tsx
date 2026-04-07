import { CodeBlock } from "./CodeBlock";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

export const DocumentationSection = () => {
  const endpoint = `POST /functions/v1/detect-voice`;

  const requestBody = `{
  "audio": "<base64-encoded-mp3>",
  "language": "english"  // Optional: tamil, english, hindi, malayalam, telugu
}`;

  const successResponse = `{
  "classification": "<Human-generated | AI-generated | AI-morphed | Uncertain>",
  "confidence_score": "<0.0 - 1.0>",
  "explanation": "<AI-generated analysis explaining the classification reasoning>",
  "language_detected": "<detected language from audio>",
  "morphing_suspected": "<true | false>",
  "analysis_details": {
    "spectral_analysis": "<findings on harmonic structure and formant frequencies>",
    "prosodic_patterns": "<findings on pitch contours, intonation, and rhythm>",
    "temporal_consistency": "<findings on timing, pauses, and breathing patterns>",
    "acoustic_artifacts": "<findings on digital artifacts or vocoder signatures>",
    "morphing_indicators": "<findings on voice morphing or cloning attempts>"
  },
  "processing_time_ms": "<actual processing duration in milliseconds>"
}`;

  const errorResponse = `{
  "error": "Invalid audio format",
  "message": "Audio must be a valid Base64-encoded string"
}`;

  const curlExample = `curl -X POST \\
  '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-voice' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "audio": "<base64-encoded-mp3>",
    "language": "english"
  }'`;

  const pythonExample = `import requests
import base64

# Read and encode audio file
with open("voice_sample.mp3", "rb") as f:
    audio_base64 = base64.b64encode(f.read()).decode()

# Make API request
response = requests.post(
    "${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-voice",
    json={
        "audio": audio_base64,
        "language": "english"  # Optional
    }
)

result = response.json()
print(f"Classification: {result['classification']}")
print(f"Confidence: {result['confidence_score']:.2%}")`;

  const jsExample = `// Read file and convert to Base64
const file = document.querySelector('input[type="file"]').files[0];
const reader = new FileReader();

reader.onload = async () => {
  const base64 = reader.result.split(',')[1];
  
  const response = await fetch(
    '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-voice',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: base64,
        language: 'english'
      })
    }
  );
  
  const result = await response.json();
  console.log(result);
};

reader.readAsDataURL(file);`;

  return (
    <section id="docs" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            API <span className="text-gradient">Documentation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple RESTful API with JSON request/response format. 
            Get started in minutes with our comprehensive documentation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Endpoint */}
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-success/20 text-success border-success/30">POST</Badge>
              <code className="font-mono text-sm">{endpoint}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Analyze a voice sample and determine if it's AI-generated, AI-morphed, or human-generated.
            </p>
          </Card>

          {/* Request/Response */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Request Body</h3>
              <CodeBlock code={requestBody} language="json" />
              
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <code className="text-primary font-mono">audio</code>
                  <span className="text-destructive">*</span>
                  <span className="text-muted-foreground">Base64-encoded MP3 file (max 10MB)</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <code className="text-primary font-mono">language</code>
                  <span className="text-muted-foreground">Optional language hint for improved accuracy</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Supported Languages</h3>
              <Card className="p-4 bg-secondary/50">
                <div className="space-y-2">
                  {['Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu'].map((lang) => (
                    <div key={lang} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Response Examples */}
          <div>
            <h3 className="font-semibold mb-3">Response</h3>
            <Tabs defaultValue="success">
              <TabsList className="bg-secondary">
                <TabsTrigger value="success" className="data-[state=active]:bg-success/20 data-[state=active]:text-success">
                  <Check className="mr-2 h-4 w-4" />
                  Success (200)
                </TabsTrigger>
                <TabsTrigger value="error" className="data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive">
                  <X className="mr-2 h-4 w-4" />
                  Error (4xx/5xx)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="success" className="mt-4">
                <CodeBlock code={successResponse} language="json" />
              </TabsContent>
              <TabsContent value="error" className="mt-4">
                <CodeBlock code={errorResponse} language="json" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Code Examples */}
          <div>
            <h3 className="font-semibold mb-3">Making Requests</h3>
            <Tabs defaultValue="curl">
              <TabsList className="bg-secondary">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              </TabsList>
              <TabsContent value="curl" className="mt-4">
                <CodeBlock code={curlExample} language="bash" />
              </TabsContent>
              <TabsContent value="python" className="mt-4">
                <CodeBlock code={pythonExample} language="python" />
              </TabsContent>
              <TabsContent value="javascript" className="mt-4">
                <CodeBlock code={jsExample} language="javascript" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
};
