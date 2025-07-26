class OllamaAPI {
  constructor() {
    this.baseURL = import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434';
    this.defaultModel = import.meta.env.VITE_DEFAULT_MODEL || 'llama2';
    this.enableStreaming = import.meta.env.VITE_ENABLE_STREAMING === 'true';
  }

  // Check if Ollama server is running
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`);
      return {
        success: response.ok,
        status: response.ok ? 'connected' : 'disconnected',
        models: response.ok ? await response.json() : null
      };
    } catch (error) {
      return {
        success: false,
        status: 'disconnected',
        error: 'Cannot connect to Ollama server. Please ensure Ollama is running on your system.'
      };
    }
  }

  // Get available models
  async getAvailableModels() {
    try {
      const response = await fetch(`${this.baseURL}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      return {
        success: true,
        models: data.models?.map(model => ({
          name: model.name,
          size: model.size,
          modified_at: model.modified_at,
          digest: model.digest
        })) || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get available models',
        models: []
      };
    }
  }

  // Generate content with streaming support
  async generateContent(prompt, options = {}) {
    const {
      model = this.defaultModel,
      stream = this.enableStreaming,
      onProgress = null,
      contentType = 'general',
      temperature = 0.7,
      max_tokens = 2048
    } = options;

    try {
      const requestBody = {
        model,
        prompt,
        stream,
        options: {
          temperature,
          num_predict: max_tokens
        }
      };

      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (stream && onProgress) {
        return this._handleStreamingResponse(response, onProgress);
      } else {
        const data = await response.json();
        return {
          success: true,
          content: data.response,
          model: data.model,
          created_at: data.created_at,
          done: data.done
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to generate content'
      };
    }
  }

  // Handle streaming response
  async _handleStreamingResponse(response, onProgress) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.response) {
                fullContent += data.response;
                onProgress?.(data.response, fullContent, data.done);
              }
              
              if (data.done) {
                return {
                  success: true,
                  content: fullContent,
                  model: data.model,
                  created_at: data.created_at,
                  done: true
                };
              }
            } catch (parseError) {
              console.log('Error parsing streaming response:', parseError);
            }
          }
        }
      }

      return {
        success: true,
        content: fullContent,
        done: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Streaming failed'
      };
    }
  }

  // Generate with fallback models
  async generateWithFallback(prompt, options = {}) {
    const { model = this.defaultModel, fallbackModels = ['llama2', 'mistral', 'neural-chat'] } = options;
    
    const modelsToTry = [model, ...fallbackModels.filter(m => m !== model)];
    
    for (const currentModel of modelsToTry) {
      try {
        const result = await this.generateContent(prompt, {
          ...options,
          model: currentModel
        });
        
        if (result.success) {
          return {
            ...result,
            modelUsed: currentModel,
            fallbackUsed: currentModel !== model
          };
        }
      } catch (error) {
        console.log(`Model ${currentModel} failed, trying next...`);
        continue;
      }
    }
    
    return {
      success: false,
      error: 'All models failed to generate content',
      modelsAttempted: modelsToTry
    };
  }

  // Pull/download a model
  async pullModel(modelName, onProgress = null) {
    try {
      const response = await fetch(`${this.baseURL}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (onProgress) {
        return this._handlePullProgress(response, onProgress);
      } else {
        const data = await response.json();
        return {
          success: true,
          status: data.status
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to pull model'
      };
    }
  }

  // Handle model pull progress
  async _handlePullProgress(response, onProgress) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              onProgress(data);
              
              if (data.status === 'success') {
                return {
                  success: true,
                  status: 'completed'
                };
              }
            } catch (parseError) {
              console.log('Error parsing pull progress:', parseError);
            }
          }
        }
      }

      return {
        success: true,
        status: 'completed'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Pull failed'
      };
    }
  }

  // Delete a model
  async deleteModel(modelName) {
    try {
      const response = await fetch(`${this.baseURL}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        message: `Model ${modelName} deleted successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete model'
      };
    }
  }

  // Get model info
  async getModelInfo(modelName) {
    try {
      const response = await fetch(`${this.baseURL}/api/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelName })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        info: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to get model info'
      };
    }
  }
}

export const ollamaAPI = new OllamaAPI();
export default ollamaAPI;