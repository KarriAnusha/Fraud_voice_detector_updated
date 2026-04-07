-- Create api_keys table for storing generated API keys
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL,
  project_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new API keys (public API)
CREATE POLICY "Anyone can create API keys" 
ON public.api_keys 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own keys by key value (for validation)
CREATE POLICY "Anyone can read API keys" 
ON public.api_keys 
FOR SELECT 
USING (true);

-- Create index for faster key lookups
CREATE INDEX idx_api_keys_key ON public.api_keys(api_key);
CREATE INDEX idx_api_keys_active ON public.api_keys(is_active);