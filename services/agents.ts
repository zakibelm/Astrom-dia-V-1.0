
import { AgentResult, AgentTask } from "../types";
import { N8NService } from "./n8nService";

// Base Agent Class as defined in architecture
export abstract class BaseAgent {
  protected name: string;
  protected capabilities: string[];
  
  constructor(name: string, capabilities: string[]) {
    this.name = name;
    this.capabilities = capabilities;
  }
  
  abstract execute(task: AgentTask): Promise<AgentResult>;
  
  protected async callN8nBackend(
    endpoint: string, 
    data: any
  ): Promise<any> {
    // In a real app, this fetches /api/n8n/webhook
    console.log(`[${this.name}] Calling N8N Workflow: ${endpoint}`);
    return await N8NService.generateContent(endpoint, data);
  }
  
  protected async logToBackend(action: string, result: any): Promise<void> {
    console.log(`[${this.name}] LOG: ${action}`, result);
  }
}

// Research Agent (NEW)
export class ResearchAgent extends BaseAgent {
  constructor() {
    super('ResearchAnalyst', ['market_intel', 'lead_gen', 'competitor_analysis']);
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    try {
      // Simulate calling external APIs via N8N
      // In a real scenario, this would trigger Hunter.io / Apollo / SimilarWeb
      const result = await this.callN8nBackend('market-research', {
        industry: task.context.industry,
        topic: task.context.topic
      });

      return {
        success: true,
        data: {
          competitors: ['Competitor A', 'Competitor B'],
          trends: ['Trend 1', 'Trend 2'],
          leadsFound: 15,
          sources: ['Apollo.io', 'SimilarWeb']
        },
        metadata: {
          agent: this.name,
          executionTime: Date.now() - startTime,
          modelUsed: 'gpt-4o',
          cost: 0.05,
          toolsUsed: ['Apollo.io', 'SimilarWeb', 'Google Trends']
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        metadata: { agent: this.name, executionTime: Date.now() - startTime }
      };
    }
  }
}

// Copywriter Agent
export class CopywriterAgent extends BaseAgent {
  constructor() {
    super('CopywriterAgent', ['blog_writing', 'ad_copy', 'email_content']);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    try {
      const analysisResult = {
         complexity: 'medium',
         recommendedModel: 'claude-sonnet-4.5'
      };
      
      const generationResult = await this.callN8nBackend('generate-copy', {
          taskType: task.type,
          context: task.context,
          analysis: analysisResult,
          brandVoiceId: task.context.brandVoiceId
      });
      
      const refinedContent = generationResult.content.trim();
      
      await this.logToBackend('copy_generated', { 
        model: generationResult.modelUsed 
      });
      
      return {
        success: true,
        data: refinedContent,
        metadata: {
          agent: this.name,
          executionTime: Date.now() - startTime,
          modelUsed: generationResult.modelUsed,
          cost: generationResult.cost,
          toolsUsed: ['Anthropic API', 'Grammarly SDK']
        }
      };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            metadata: { agent: this.name, executionTime: Date.now() - startTime }
        };
    }
  }
}

// SEO Agent
export class SEOAgent extends BaseAgent {
  constructor() {
    super('SEOAgent', ['keyword_research', 'content_optimization']);
  }
  
  async execute(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    if (task.type === 'keyword_research') {
        const keywords = await this.callN8nBackend('seo-keyword-research', {
            topic: task.context.topic
        });
        
        const analyzed = keywords.data.map((k: any) => ({
            ...k,
            opportunityScore: (k.searchVolume / 1000) * (100 - k.difficulty)
        })).sort((a: any, b: any) => b.opportunityScore - a.opportunityScore);
        
        return {
            success: true,
            data: analyzed,
            metadata: {
                agent: this.name,
                executionTime: Date.now() - startTime,
                modelUsed: keywords.modelUsed,
                toolsUsed: ['DataForSEO', 'Google Search Console API']
            }
        };
    }
    return { success: false, metadata: { agent: this.name, executionTime: 0 }};
  }
}

// Social Media Agent
export class SocialMediaAgent extends BaseAgent {
    constructor() {
        super('SocialMediaAgent', ['post_generation']);
    }

    async execute(task: AgentTask): Promise<AgentResult> {
        const startTime = Date.now();
        const platforms = task.context.platforms || ['linkedin'];
        const posts: any = {};

        await Promise.all(platforms.map(async (platform: string) => {
            try {
                const result = await this.callN8nBackend('generate-social-post', {
                    platform,
                    content: task.context.content,
                    tone: task.context.tone
                });
                posts[platform] = result.content;
            } catch (error) {
                console.error(`Failed to generate for ${platform}`, error);
                posts[platform] = null;
            }
        }));

        return {
            success: true,
            data: posts,
            metadata: {
                agent: this.name,
                executionTime: Date.now() - startTime,
                toolsUsed: ['Mention.com', 'Unsplash API', 'OpenAI DALL-E']
            }
        };
    }
}
