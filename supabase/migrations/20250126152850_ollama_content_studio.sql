-- Location: supabase/migrations/20250126152850_ollama_content_studio.sql
-- AI-Powered Content Generator with Ollama - Complete Schema

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE public.content_type AS ENUM ('blog_post', 'social_media', 'product_description', 'marketing_copy', 'technical_docs');
CREATE TYPE public.generation_status AS ENUM ('pending', 'generating', 'completed', 'failed', 'cancelled');
CREATE TYPE public.model_status AS ENUM ('available', 'downloading', 'installing', 'error', 'not_found');

-- Critical intermediary table for auth
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ollama Models Management
CREATE TABLE public.ollama_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    size_bytes BIGINT,
    parameters TEXT,
    status public.model_status DEFAULT 'available'::public.model_status,
    download_progress INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    is_favorite BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Content Generation History
CREATE TABLE public.content_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    content_type public.content_type NOT NULL,
    prompt TEXT NOT NULL,
    generated_content TEXT,
    status public.generation_status DEFAULT 'pending'::public.generation_status,
    generation_time_ms INTEGER,
    prompt_length INTEGER,
    content_length INTEGER,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Content Templates
CREATE TABLE public.content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    content_type public.content_type NOT NULL,
    prompt_template TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Generation Queue for background processing
CREATE TABLE public.generation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content_generation_id UUID REFERENCES public.content_generations(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 1,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    scheduled_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System Analytics
CREATE TABLE public.system_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_ollama_models_status ON public.ollama_models(status);
CREATE INDEX idx_ollama_models_name ON public.ollama_models(name);
CREATE INDEX idx_content_generations_user_id ON public.content_generations(user_id);
CREATE INDEX idx_content_generations_status ON public.content_generations(status);
CREATE INDEX idx_content_generations_created_at ON public.content_generations(created_at);
CREATE INDEX idx_content_templates_user_id ON public.content_templates(user_id);
CREATE INDEX idx_content_templates_content_type ON public.content_templates(content_type);
CREATE INDEX idx_generation_queue_user_id ON public.generation_queue(user_id);
CREATE INDEX idx_generation_queue_status ON public.generation_queue(scheduled_at, completed_at);
CREATE INDEX idx_system_analytics_event_type ON public.system_analytics(event_type);
CREATE INDEX idx_system_analytics_created_at ON public.system_analytics(created_at);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ollama_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_analytics ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.owns_content(content_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.content_generations cg
    WHERE cg.id = content_uuid AND cg.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.owns_template(template_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.content_templates ct
    WHERE ct.id = template_uuid AND (ct.user_id = auth.uid() OR ct.is_public = true)
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_queue_item(queue_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.generation_queue gq
    WHERE gq.id = queue_uuid AND gq.user_id = auth.uid()
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ollama_models_updated_at
    BEFORE UPDATE ON public.ollama_models
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_generations_updated_at
    BEFORE UPDATE ON public.content_generations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at
    BEFORE UPDATE ON public.content_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "public_models_read" ON public.ollama_models FOR SELECT
TO public USING (true);

CREATE POLICY "admin_models_manage" ON public.ollama_models FOR ALL
TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "users_own_generations" ON public.content_generations FOR ALL
TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_own_templates" ON public.content_templates FOR ALL
TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "public_templates_read" ON public.content_templates FOR SELECT
TO authenticated USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "users_own_queue" ON public.generation_queue FOR ALL
TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "admin_analytics_access" ON public.system_analytics FOR ALL
TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "users_own_analytics" ON public.system_analytics FOR SELECT
TO authenticated USING (user_id = auth.uid());

-- 6. Default Ollama Models Data
INSERT INTO public.ollama_models (name, display_name, description, size_bytes, parameters, tags) VALUES
    ('llama2', 'Llama 2', 'Meta''s Llama 2 model for general text generation', 3826793024, '7B', ARRAY['general', 'chat', 'recommended']),
    ('llama2:13b', 'Llama 2 13B', 'Larger Llama 2 model with better performance', 7365960704, '13B', ARRAY['general', 'chat', 'large']),
    ('codellama', 'Code Llama', 'Specialized model for code generation and analysis', 3826793024, '7B', ARRAY['code', 'programming', 'recommended']),
    ('mistral', 'Mistral 7B', 'Fast and efficient model for various tasks', 4109248512, '7B', ARRAY['general', 'fast', 'efficient']),
    ('neural-chat', 'Neural Chat', 'Optimized for conversational AI and chat applications', 4221157376, '7B', ARRAY['chat', 'conversation']),
    ('starcode', 'StarCoder', 'Advanced code generation and completion model', 8587640832, '15B', ARRAY['code', 'programming', 'large']),
    ('vicuna', 'Vicuna', 'Fine-tuned model based on LLaMA for chat applications', 4221157376, '7B', ARRAY['chat', 'fine-tuned']),
    ('orca-mini', 'Orca Mini', 'Compact model with good reasoning capabilities', 1970934784, '3B', ARRAY['small', 'reasoning', 'efficient']);

-- 7. Sample Content Templates
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Create sample templates for the first admin user
    SELECT id INTO sample_user_id FROM public.user_profiles WHERE role = 'admin' LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        INSERT INTO public.content_templates (user_id, name, content_type, prompt_template, variables, is_public) VALUES
            (sample_user_id, 'Blog Post Outline', 'blog_post', 'Create a detailed blog post outline for: {{topic}}. Include an engaging introduction, 3-5 main sections with subpoints, and a strong conclusion. Target audience: {{audience}}', '{"topic": "", "audience": "general readers"}', true),
            (sample_user_id, 'Social Media Caption', 'social_media', 'Write an engaging social media caption for {{platform}} about: {{content}}. Include relevant hashtags and a call-to-action. Tone: {{tone}}', '{"platform": "Instagram", "content": "", "tone": "friendly"}', true),
            (sample_user_id, 'Product Description', 'product_description', 'Write a compelling product description for: {{product_name}}. Highlight key features: {{features}}. Target customer: {{target_customer}}. Include benefits and a call-to-action.', '{"product_name": "", "features": "", "target_customer": ""}', true),
            (sample_user_id, 'Email Marketing', 'marketing_copy', 'Create an email marketing campaign for: {{campaign_goal}}. Subject line and body text. Target audience: {{audience}}. Include personalization and clear CTA.', '{"campaign_goal": "", "audience": ""}', true);
    END IF;
END $$;

-- 8. Mock Data for Development
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    user_uuid UUID := gen_random_uuid();
    generation_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@ollama.studio', crypt('demo123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@ollama.studio', crypt('demo123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample content generations
    INSERT INTO public.content_generations (id, user_id, model_name, content_type, prompt, generated_content, status, generation_time_ms, prompt_length, content_length)
    VALUES
        (generation_uuid, admin_uuid, 'llama2', 'blog_post', 'Write a blog post about the benefits of using AI for content creation', 'AI-powered content creation has revolutionized how we approach writing and marketing. Here are the key benefits: 1. Speed and Efficiency, 2. Consistency, 3. Creativity Enhancement, 4. Cost-Effectiveness. AI tools can help writers overcome creative blocks and produce high-quality content at scale.', 'completed', 2350, 82, 376),
        (gen_random_uuid(), user_uuid, 'codellama', 'technical_docs', 'Create API documentation for a REST endpoint', 'GET /api/users - Retrieves a list of users. Parameters: limit (optional), offset (optional). Returns: JSON array of user objects. Status codes: 200 (success), 400 (bad request), 500 (server error).', 'completed', 1890, 45, 198);

    -- Create sample analytics
    INSERT INTO public.system_analytics (event_type, event_data, user_id) VALUES
        ('model_download', '{"model_name": "llama2", "size_mb": 3648}', admin_uuid),
        ('content_generation', '{"model": "llama2", "type": "blog_post", "duration_ms": 2350}', admin_uuid),
        ('template_usage', '{"template_id": "blog_outline", "user_modifications": true}', user_uuid);
END $$;