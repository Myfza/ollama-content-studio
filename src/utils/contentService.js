import { supabase, handleSupabaseError } from './supabaseClient';
import ollamaAPI from './ollamaService';

const contentService = {
  // Create content generation record
  createContentGeneration: async (userId, generationData) => {
    try {
      const { data, error } = await supabase
        .from('content_generations')
        .insert({
          user_id: userId,
          model_name: generationData.model,
          content_type: generationData.contentType,
          prompt: generationData.prompt,
          status: 'pending',
          prompt_length: generationData.prompt?.length || 0,
          metadata: generationData.metadata || {}
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'create generation') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'create generation') };
    }
  },

  // Update content generation with results
  updateContentGeneration: async (generationId, updates) => {
    try {
      const { data, error } = await supabase
        .from('content_generations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', generationId)
        .select()
        .single();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'update generation') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'update generation') };
    }
  },

  // Get user's content generation history
  getUserGenerations: async (userId, options = {}) => {
    try {
      const { limit = 50, offset = 0, contentType = null, status = null } = options;
      
      let query = supabase
        .from('content_generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'get generations') };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'get generations') };
    }
  },

  // Generate content with Ollama and save to database
  generateContent: async (userId, options = {}) => {
    const {
      prompt,
      model = 'llama2',
      contentType = 'general',
      onProgress = null,
      saveToDatabase = true
    } = options;

    const startTime = Date.now();
    let generationRecord = null;

    try {
      // Create database record if saving
      if (saveToDatabase) {
        const createResult = await contentService.createContentGeneration(userId, {
          model,
          contentType,
          prompt,
          metadata: { startTime }
        });

        if (!createResult.success) {
          return createResult;
        }

        generationRecord = createResult.data;

        // Update status to generating
        await contentService.updateContentGeneration(generationRecord.id, {
          status: 'generating'
        });
      }

      // Generate content with Ollama
      const generationResult = await ollamaAPI.generateWithFallback(prompt, {
        model,
        onProgress: (chunk, fullContent, done) => {
          onProgress?.(chunk, fullContent, done);
          
          // Update database with streaming content if saving
          if (saveToDatabase && generationRecord && done) {
            contentService.updateContentGeneration(generationRecord.id, {
              generated_content: fullContent,
              status: 'completed',
              generation_time_ms: Date.now() - startTime,
              content_length: fullContent?.length || 0
            });
          }
        }
      });

      if (!generationResult.success) {
        // Update database with error if saving
        if (saveToDatabase && generationRecord) {
          await contentService.updateContentGeneration(generationRecord.id, {
            status: 'failed',
            error_message: generationResult.error,
            generation_time_ms: Date.now() - startTime
          });
        }

        return generationResult;
      }

      // Update database with final results if saving and not streaming
      if (saveToDatabase && generationRecord && !ollamaAPI.enableStreaming) {
        const updateResult = await contentService.updateContentGeneration(generationRecord.id, {
          generated_content: generationResult.content,
          status: 'completed',
          generation_time_ms: Date.now() - startTime,
          content_length: generationResult.content?.length || 0
        });

        return {
          success: true,
          content: generationResult.content,
          model: generationResult.modelUsed,
          generationRecord: updateResult.data,
          fallbackUsed: generationResult.fallbackUsed
        };
      }

      return {
        success: true,
        content: generationResult.content,
        model: generationResult.modelUsed,
        generationRecord,
        fallbackUsed: generationResult.fallbackUsed
      };

    } catch (error) {
      // Update database with error if saving
      if (saveToDatabase && generationRecord) {
        await contentService.updateContentGeneration(generationRecord.id, {
          status: 'failed',
          error_message: error.message,
          generation_time_ms: Date.now() - startTime
        });
      }

      return {
        success: false,
        error: error.message || 'Content generation failed'
      };
    }
  },

  // Get content templates
  getTemplates: async (userId, options = {}) => {
    try {
      const { contentType = null, includePublic = true } = options;
      
      let query = supabase
        .from('content_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (includePublic) {
        query = query.or(`user_id.eq.${userId},is_public.eq.true`);
      } else {
        query = query.eq('user_id', userId);
      }

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'get templates') };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'get templates') };
    }
  },

  // Create content template
  createTemplate: async (userId, templateData) => {
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .insert({
          user_id: userId,
          name: templateData.name,
          content_type: templateData.contentType,
          prompt_template: templateData.promptTemplate,
          variables: templateData.variables || {},
          is_public: templateData.isPublic || false
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'create template') };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error, 'create template') };
    }
  },

  // Get generation statistics
  getGenerationStats: async (userId, timeframe = '30d') => {
    try {
      const { data, error } = await supabase.rpc('get_user_generation_stats', {
        user_id: userId,
        timeframe_days: timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90
      });

      if (error) {
        return { success: false, error: handleSupabaseError(error, 'get stats') };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      // Fallback to basic query if RPC function doesn't exist
      try {
        const timeframeDays = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - timeframeDays);

        const { data, error } = await supabase
          .from('content_generations')
          .select('content_type, status, generation_time_ms, created_at')
          .eq('user_id', userId)
          .gte('created_at', fromDate.toISOString());

        if (error) throw error;

        // Process stats manually
        const stats = {
          totalGenerations: data.length,
          completedGenerations: data.filter(g => g.status === 'completed').length,
          failedGenerations: data.filter(g => g.status === 'failed').length,
          averageTime: data.length > 0 
            ? data.reduce((sum, g) => sum + (g.generation_time_ms || 0), 0) / data.length 
            : 0,
          contentTypeBreakdown: {}
        };

        data.forEach(g => {
          stats.contentTypeBreakdown[g.content_type] = 
            (stats.contentTypeBreakdown[g.content_type] || 0) + 1;
        });

        return { success: true, data: stats };
      } catch (fallbackError) {
        return { success: false, error: handleSupabaseError(fallbackError, 'get stats') };
      }
    }
  }
};

export default contentService;