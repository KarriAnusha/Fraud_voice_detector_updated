-- Add user_id column to api_keys table (nullable for existing records)
ALTER TABLE public.api_keys ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Anyone can read API keys" ON public.api_keys;

-- Create secure RLS policies
-- Users can only read their own API keys
CREATE POLICY "Users can view their own API keys"
ON public.api_keys
FOR SELECT
USING (auth.uid() = user_id);

-- Only authenticated users can create API keys (linked to their user_id)
CREATE POLICY "Authenticated users can create their own API keys"
ON public.api_keys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own API keys
CREATE POLICY "Users can update their own API keys"
ON public.api_keys
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own API keys
CREATE POLICY "Users can delete their own API keys"
ON public.api_keys
FOR DELETE
USING (auth.uid() = user_id);