import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Initialize Supabase client for API key validation
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function validateApiKey(apiKey: string): Promise<{ valid: boolean; userId?: string; error?: string }> {
  if (!apiKey) {
    return { valid: false, error: "Missing API key" };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Check if API key exists and is active
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, user_id, is_active")
    .eq("api_key", apiKey)
    .single();

  if (error || !data) {
    console.log("API key validation failed:", error?.message || "Key not found");
    return { valid: false, error: "Invalid API key" };
  }

  if (!data.is_active) {
    return { valid: false, error: "API key is inactive" };
  }

  // Update last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  console.log("API key validated successfully for user:", data.user_id);
  return { valid: true, userId: data.user_id };
}

interface DetectionRequest {
  // Support both formats:
  // 1. Original: { audio: "base64..." }
  // 2. External tool: { audio_base64: "base64...", audio_format: "mp3", language: "english" }
  audio?: string; // Base64-encoded MP3 (original format)
  audio_base64?: string; // Base64-encoded audio (external tool format)
  audio_format?: string; // Audio format like "mp3" (external tool format)
  language?: string; // Optional: tamil, english, hindi, malayalam, telugu
}

interface DetectionResponse {
  classification: "AI-generated" | "Human-generated" | "AI-morphed" | "AI-cloned" | "Uncertain";
  confidence_score: number;
  explanation: string;
  language_detected?: string;
  morphing_suspected: boolean;
  analysis_details: {
    spectral_analysis: string;
    prosodic_patterns: string;
    temporal_consistency: string;
    acoustic_artifacts: string;
    morphing_indicators: string;
  };
  processing_time_ms: number;
}

/**
 * Heuristic metadata detection.
 *
 * Some generators (incl. ElevenLabs) may embed C2PA/ID3 metadata that survives
 * conversion/export even when audio artifacts are very subtle.
 * We treat this as a strong signal of AI tooling involvement.
 */
function detectGeneratorHints(audioBytes: Uint8Array) {
  // Decode a small prefix for performance (metadata is typically near the start).
  const prefixLen = Math.min(audioBytes.length, 256 * 1024); // 256KB
  const prefixText = new TextDecoder("utf-8", { fatal: false }).decode(
    audioBytes.slice(0, prefixLen),
  );

  const normalized = prefixText.toLowerCase();
  const elevenLabs = normalized.includes("elevenlabs");
  const c2pa = normalized.includes("c2pa");
  const manifestStore = normalized.includes("manifest-store");

  return {
    elevenLabs,
    c2pa,
    manifestStore,
    hasGeneratorHint: elevenLabs || (c2pa && manifestStore),
    // keep the original-case snippet out of logs/response to avoid dumping binary;
    // just return boolean signals.
  };
}

// Supported languages
const SUPPORTED_LANGUAGES = ['tamil', 'english', 'hindi', 'malayalam', 'telugu'];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // ========== AUTHENTICATION ==========
    // Support two auth modes:
    // 1. API key in x-api-key header (for external API consumers)
    // 2. JWT token in Authorization header (for playground/internal use)
    
    const apiKey = req.headers.get("x-api-key") || req.headers.get("X-API-Key") || req.headers.get("api-key");
    const authHeader = req.headers.get("Authorization");
    
    let isAuthenticated = false;
    let authMethod = "";
    
    // Try API key first
    if (apiKey) {
      const keyValidation = await validateApiKey(apiKey);
      if (keyValidation.valid) {
        isAuthenticated = true;
        authMethod = "api_key";
        console.log("Authenticated via API key for user:", keyValidation.userId);
      }
    }
    
    // If no API key or invalid, try JWT auth (for playground users)
    if (!isAuthenticated && authHeader?.startsWith("Bearer ")) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (!userError && userData?.user) {
        isAuthenticated = true;
        authMethod = "jwt";
        console.log("Authenticated via JWT for user:", userData.user.id);
      }
    }
    
    // If still not authenticated, return 401
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
          message: "Please provide a valid API key in 'x-api-key' header or sign in to use the playground"
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log(`Request authenticated via ${authMethod}`);

    // ========== PARSE REQUEST BODY ==========
    const requestBody = await req.json();
    
    // Log all received field names to debug external tool format
    console.log("Request fields received:", Object.keys(requestBody));
    
    // Support multiple field name variations (case-insensitive matching)
    const findAudioField = (body: Record<string, unknown>): string | undefined => {
      // Check exact matches first (priority order)
      if (body.audio && typeof body.audio === 'string') return body.audio as string;
      if (body.audio_base64 && typeof body.audio_base64 === 'string') return body.audio_base64 as string;
      if (body.audioBase64 && typeof body.audioBase64 === 'string') return body.audioBase64 as string;
      
      // Check case-insensitive and variant matches
      // IMPORTANT: Exclude format-related fields to avoid matching "audioFormat" as audio data
      const audioKeys = ['audio', 'audiobase64', 'audio_base64', 'base64', 'audio_data', 'audiodata', 'file', 'data'];
      const excludePatterns = ['format', 'type', 'mime', 'encoding'];
      
      for (const key of Object.keys(body)) {
        const lowerKey = key.toLowerCase().replace(/[\s_-]/g, '');
        
        // Skip if this looks like a format/type field
        if (excludePatterns.some(ex => lowerKey.includes(ex))) {
          continue;
        }
        
        if (audioKeys.some(ak => lowerKey === ak || lowerKey.endsWith(ak)) && typeof body[key] === 'string') {
          console.log(`Found audio data in field: "${key}"`);
          return body[key] as string;
        }
      }
      return undefined;
    };
    
    let audio = findAudioField(requestBody);
    
    // Strip data URI prefix if present (e.g., "data:audio/mp3;base64,...")
    if (audio && audio.includes(',')) {
      const parts = audio.split(',');
      if (parts[0].includes('base64')) {
        audio = parts[1];
        console.log("Stripped data URI prefix from audio");
      }
    }
    
    const language = requestBody.language || requestBody.Language;
    const audioFormat = requestBody.audio_format || requestBody.audioFormat || requestBody.format || "mp3";
    
    console.log("Request received - audio found:", !!audio, ", format:", audioFormat, ", language:", language || "auto-detect");

    // Validate input
    if (!audio) {
      return new Response(
        JSON.stringify({
          error: "Missing required field: audio or audio_base64",
          message: "Please provide a Base64-encoded audio file in 'audio' or 'audio_base64' field"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate Base64 format
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (!base64Regex.test(audio.replace(/\s/g, ''))) {
      return new Response(
        JSON.stringify({
          error: "Invalid audio format",
          message: "Audio must be a valid Base64-encoded string"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Decode and validate audio size
    const audioBytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const audioSizeMB = audioBytes.length / (1024 * 1024);
    
    if (audioSizeMB > 10) {
      return new Response(
        JSON.stringify({
          error: "Audio file too large",
          message: "Maximum file size is 10MB"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate language if provided
    if (language && !SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
      return new Response(
        JSON.stringify({
          error: "Unsupported language",
          message: `Supported languages: ${SUPPORTED_LANGUAGES.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Heuristic: detect generator metadata hints (e.g., ElevenLabs / C2PA)
    const generatorHints = detectGeneratorHints(audioBytes);
    if (generatorHints.hasGeneratorHint) {
      console.log(
        "Generator metadata hint detected:",
        JSON.stringify({ elevenLabs: generatorHints.elevenLabs, c2pa: generatorHints.c2pa, manifestStore: generatorHints.manifestStore }),
      );
    }

    // Get the Lovable API key for AI analysis
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // ========== PASS 1: Artifact Detection ==========
    // NOTE: Pass 1 should be technical, but NOT biased toward "finding something".
    // False positives are the #1 issue, so this pass explicitly avoids treating
    // clarity/accents/scripted delivery as AI evidence.
    const pass1Prompt = `You are a forensic audio analyst. LISTEN carefully and report ONLY concrete, audible technical artifacts.

IMPORTANT: Avoid false positives.
- Do NOT treat clear enunciation, scripted/teacher-like delivery, or regional Indian accents as AI indicators.
- Do NOT treat studio-like silence as AI unless it is *digitally gated* in a way that is unnatural.

Report these signals ONLY if clearly present:

**Neural Vocoder / Synthesis artifacts:** metallic/buzzy vowels, watery resonance, phoneme-boundary clicks, unnatural high-frequency cutoffs, robotic timbre.
**TTS markers:** flat/monotone intonation *despite* question forms, identical prosody across phrases, unnatural coarticulation.
**Voice conversion (morphing):** formant discontinuities, pitch-shift artifacts, spectral envelope mismatch, real-time processing glitches.
**Voice cloning signatures:** ultra-consistent speaker embedding, lack of natural voice variability, ElevenLabs/Resemble.ai neural vocoder patterns, perfect prosodic consistency across long utterances.

Respond ONLY with JSON:
{
  "vocoder_artifacts_detected": true/false,
  "morphing_indicators_detected": true/false,
  "tts_markers_detected": true/false,
  "cloning_indicators_detected": true/false,
  "specific_findings": ["concrete audible artifacts"],
  "natural_speech_indicators": ["concrete human indicators"],
  "suspicion_level": "high" | "medium" | "low"
}`;

    console.log("Starting Pass 1: Artifact detection...");
    
    const pass1Response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Flash is significantly faster and usually sufficient for artifact spotting.
        // We compensate accuracy by using strict post-processing rules below.
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: pass1Prompt },
              { type: "input_audio", input_audio: { data: audio, format: "mp3" } }
            ]
          }
        ],
        temperature: 0.1, // Very low for consistent artifact detection
      }),
    });

    if (!pass1Response.ok) {
      const errorText = await pass1Response.text();
      console.error("Pass 1 failed:", pass1Response.status, errorText);
      throw new Error(`Pass 1 analysis failed: ${pass1Response.status}`);
    }

    const pass1Result = await pass1Response.json();
    const pass1Content = pass1Result.choices?.[0]?.message?.content;
    
    if (!pass1Content) {
      throw new Error("No content from Pass 1 analysis");
    }

    let artifactAnalysis;
    try {
      const cleanPass1 = pass1Content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      artifactAnalysis = JSON.parse(cleanPass1);
    } catch (e) {
      console.error("Failed to parse Pass 1:", pass1Content);
      artifactAnalysis = {
        vocoder_artifacts_detected: false,
        morphing_indicators_detected: false,
        tts_markers_detected: false,
        specific_findings: [],
        natural_speech_indicators: [],
        suspicion_level: "medium"
      };
    }

    console.log("Pass 1 complete:", JSON.stringify(artifactAnalysis));

    // ========== PASS 2: Final Classification ==========
    const pass2Prompt = `You are a forensic audio analyst making a final classification. LISTEN to this audio carefully. Your PRIMARY GOAL is to AVOID FALSE POSITIVES - wrongly accusing a human of using AI is worse than missing an AI voice.

**Context from preliminary analysis:**
- Vocoder artifacts detected: ${artifactAnalysis.vocoder_artifacts_detected}
- Voice morphing indicators: ${artifactAnalysis.morphing_indicators_detected}
- TTS markers detected: ${artifactAnalysis.tts_markers_detected}
- Voice cloning indicators: ${artifactAnalysis.cloning_indicators_detected || false}
- Specific findings: ${JSON.stringify(artifactAnalysis.specific_findings)}
- Natural speech indicators: ${JSON.stringify(artifactAnalysis.natural_speech_indicators)}
- Preliminary suspicion level: ${artifactAnalysis.suspicion_level}

${language ? `Expected language: ${language}` : 'Detect the language from: Tamil, English, Hindi, Malayalam, or Telugu'}

**CRITICAL: UNDERSTAND THESE HUMAN SPEECH PATTERNS (NOT AI indicators):**
- Reading from a script or teaching/explaining content naturally produces consistent pacing
- Regional Indian accents (Tamil, Telugu, Malayalam, Hindi) have unique prosodic patterns that differ from Western speech
- Bilingual speakers switching languages often have consistent rhythm patterns - THIS IS NORMAL
- Professional speakers, teachers, content creators speak clearly - this is NOT robotic
- Studio recordings or quiet rooms lack background noise - this does NOT indicate synthesis
- Consistent energy levels can occur when someone is focused or reading prepared content
- Clear enunciation is a skill, not a sign of AI generation

**Classification Rules (EXTREMELY CONSERVATIVE):**

1. **AI-generated**: ONLY classify if you hear UNMISTAKABLE TTS/synthesis artifacts:
   - Obvious glitches, digital artifacts, or unnatural frequency cutoffs
   - Completely flat, monotone delivery with zero pitch variation
   - Audible synthesis artifacts like buzzing, clicking at phoneme boundaries
   - Generic TTS voice with no personality or unique characteristics
   - DO NOT classify as AI just because speech is clear, consistent, or well-paced

2. **AI-cloned**: ONLY classify if you detect voice cloning signatures:
   - ElevenLabs, Resemble.ai, or similar neural voice cloning patterns
   - Ultra-consistent speaker embedding with unnatural perfection
   - Voice sounds like a specific person but with subtle neural vocoder artifacts
   - Perfect prosodic consistency that exceeds natural human variability
   - Metadata hints (ElevenLabs/C2PA) combined with cloning-specific audio patterns

3. **AI-morphed**: ONLY classify if you detect CLEAR voice conversion artifacts:
   - Audible pitch-shifting artifacts or formant discontinuities
   - Obvious real-time processing latency or glitches
   - Voice doesn't match apparent speaker characteristics in unnatural ways
   - Real voice transformed to sound like someone else
   
4. **Human-generated**: DEFAULT classification. Use for:
   - Any natural-sounding speech, even if unusually clear or consistent
   - Speech with regional accents or unfamiliar prosodic patterns
   - Professional or scripted speech
   - Recordings with or without background noise
   
5. **Uncertain**: Use ONLY when you genuinely cannot determine either way.

**FINAL CHECK BEFORE CLASSIFYING AS AI:**
Ask yourself: "Would a skilled human speaker sound exactly like this?" If YES, classify as Human-generated.
The burden of proof is on detecting AI, not proving humanness.

Respond ONLY with this JSON:
{
  "classification": "AI-generated" | "Human-generated" | "AI-morphed" | "AI-cloned" | "Uncertain",
  "confidence_score": (0.0 to 1.0),
  "explanation": "(2-3 sentences explaining your classification based on what you heard)",
  "language_detected": "(detected language)",
  "morphing_suspected": true/false,
  "cloning_suspected": true/false,
  "analysis_details": {
    "spectral_analysis": "(frequency/harmonic observations)",
    "prosodic_patterns": "(pitch/rhythm/intonation findings)",
    "temporal_consistency": "(timing/pause analysis)",
    "acoustic_artifacts": "(any synthetic artifacts detected)",
    "morphing_indicators": "(specific voice conversion signs if any)",
    "cloning_indicators": "(specific voice cloning signs if any)"
  }
}`;

    console.log("Starting Pass 2: Final classification...");

    const pass2Response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Flash reduces latency dramatically; final decision is gated by Pass 1 evidence.
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: pass2Prompt },
              { type: "input_audio", input_audio: { data: audio, format: "mp3" } }
            ]
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!pass2Response.ok) {
      if (pass2Response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (pass2Response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await pass2Response.text();
      console.error("Pass 2 failed:", pass2Response.status, errorText);
      throw new Error(`Pass 2 analysis failed: ${pass2Response.status}`);
    }

    const pass2Result = await pass2Response.json();
    const pass2Content = pass2Result.choices?.[0]?.message?.content;

    if (!pass2Content) {
      throw new Error("No content from Pass 2 analysis");
    }

    let finalAnalysis;
    try {
      const cleanPass2 = pass2Content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      finalAnalysis = JSON.parse(cleanPass2);
    } catch (e) {
      console.error("Failed to parse Pass 2:", pass2Content);
      throw new Error("Failed to parse final analysis");
    }

    const processingTime = Date.now() - startTime;

    // If metadata strongly indicates ElevenLabs/C2PA involvement, bias toward AI-morphed.
    // This reduces false negatives for ultra-natural conversions.
    const metadataStrongSignal = generatorHints.hasGeneratorHint;

    // Post-processing: Apply evidence-gated logic.
    // The model can hallucinate "artifacts" on clean human audio. We therefore:
    // 1) Trust metadata hints (strong evidence)
    // 2) Otherwise, only allow AI labels when Pass 1 detected corresponding artifacts
    //    AND Pass 1 suspicion is high.
    let finalClassification = metadataStrongSignal ? "AI-cloned" : finalAnalysis.classification;
    let finalConfidence = metadataStrongSignal ? 0.97 : Math.round(finalAnalysis.confidence_score * 100) / 100;

    const suspicion = (artifactAnalysis?.suspicion_level ?? "medium") as "high" | "medium" | "low";
    const evidenceAI = Boolean(artifactAnalysis?.tts_markers_detected || artifactAnalysis?.vocoder_artifacts_detected);
    const evidenceMorphed = Boolean(artifactAnalysis?.morphing_indicators_detected);
    const evidenceCloned = Boolean(artifactAnalysis?.cloning_indicators_detected);

    // Hard gate: don't allow AI labels unless Pass 1 strongly supports it.
    if (!metadataStrongSignal) {
      if (finalClassification === "AI-generated" && (!evidenceAI || suspicion !== "high")) {
        finalClassification = "Uncertain";
        finalConfidence = Math.min(finalConfidence, 0.7);
      }

      if (finalClassification === "AI-cloned" && (!evidenceCloned || suspicion !== "high")) {
        finalClassification = "Uncertain";
        finalConfidence = Math.min(finalConfidence, 0.7);
      }

      if (finalClassification === "AI-morphed" && (!evidenceMorphed || suspicion !== "high")) {
        finalClassification = "Uncertain";
        finalConfidence = Math.min(finalConfidence, 0.7);
      }
    }

    // If confidence is between 60-85% and classification is AI-generated, AI-morphed, or AI-cloned,
    // reclassify as Uncertain to reduce false positives
    if (!metadataStrongSignal && 
        (finalClassification === "AI-generated" || finalClassification === "AI-morphed" || finalClassification === "AI-cloned") && 
        finalConfidence >= 0.60 && finalConfidence < 0.85) {
      finalClassification = "Uncertain";
    }

    // If confidence is below 60% for AI classifications, lean toward Human
    if (!metadataStrongSignal && 
        (finalClassification === "AI-generated" || finalClassification === "AI-morphed" || finalClassification === "AI-cloned") && 
        finalConfidence < 0.60) {
      finalClassification = "Uncertain";
      finalConfidence = 0.50; // Reset to indicate high uncertainty
    }

    const response: DetectionResponse = {
      classification: finalClassification as DetectionResponse["classification"],
      confidence_score: finalConfidence,
      explanation: metadataStrongSignal
        ? `The uploaded audio contains embedded generator metadata consistent with AI voice cloning tools (e.g., ElevenLabs/C2PA). This metadata strongly indicates the voice was created using voice cloning technology.`
        : finalAnalysis.explanation,
      language_detected: finalAnalysis.language_detected || language || "unknown",
      morphing_suspected: metadataStrongSignal
        ? true
        : (finalAnalysis.morphing_suspected || artifactAnalysis.morphing_indicators_detected),
      analysis_details: {
        ...(finalAnalysis.analysis_details ?? {
          spectral_analysis: "",
          prosodic_patterns: "",
          temporal_consistency: "",
          acoustic_artifacts: "",
          morphing_indicators: "",
        }),
        acoustic_artifacts: metadataStrongSignal
          ? `Metadata signal detected (${[
              generatorHints.elevenLabs ? "elevenlabs" : null,
              generatorHints.c2pa ? "c2pa" : null,
              generatorHints.manifestStore ? "manifest-store" : null,
            ].filter(Boolean).join(", ")}); audio artifacts may be subtle in high-quality conversions.`
          : (finalAnalysis.analysis_details?.acoustic_artifacts ?? ""),
        morphing_indicators: metadataStrongSignal
          ? "Embedded generator metadata indicates conversion tooling involvement."
          : (
            finalAnalysis.analysis_details?.morphing_indicators ||
            (artifactAnalysis.specific_findings?.join("; ") || "None detected")
          ),
      },
      processing_time_ms: processingTime,
    };

    console.log(`Voice detection completed in ${processingTime}ms - Classification: ${response.classification} (Morphing: ${response.morphing_suspected})`);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Voice detection error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return new Response(
      JSON.stringify({
        error: "Voice detection failed",
        message: errorMessage,
        processing_time_ms: Date.now() - startTime,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
