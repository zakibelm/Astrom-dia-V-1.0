
import { Campaign } from '../types';

/**
 * NovaMedia n8n Bridge
 * Currently simulates the n8n workflows (Observe, Execute, Verify).
 * To connect a real instance, set the WEBHOOK_BASE_URL and replace simulation logic.
 */

const WEBHOOK_BASE_URL = ""; // e.g., https://primary-production.n8n.cloud/webhook/

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c-101',
    name: 'Q3 SaaS Growth',
    client_id: 'cli-001',
    status: 'published',
    brief: {
      objective: 'Lead Generation',
      topic: 'AI in Marketing',
      industry: 'Tech',
      targetAudience: 'CMOs',
    },
    created_at: '2023-10-01T10:00:00Z',
    metrics: { roi: 3.2, impressions: 15000, clicks: 450 }
  },
  {
    id: 'c-102',
    name: 'Eco-Friendly Launch',
    client_id: 'cli-002',
    status: 'verify',
    brief: {
      objective: 'Brand Awareness',
      topic: 'Sustainable Packaging',
      industry: 'Retail',
      targetAudience: 'Gen Z',
    },
    created_at: '2023-10-05T14:30:00Z',
  }
];

export const N8NService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    // REAL: return fetch(`${WEBHOOK_BASE_URL}/campaigns`).then(r => r.json());
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_CAMPAIGNS]), 800);
    });
  },

  // Workflow 1: OBSERVE
  triggerObservePhase: async (data: any): Promise<any> => {
    console.log("[n8n Bridge] Triggering OBSERVE Workflow...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          campaignId: 'c-' + Math.floor(Math.random() * 10000),
          brandVoiceId: 'bv-123',
          marketAnalysis: {
            trends: ['AI Adoption', 'Personalization'],
            competitors: ['CompA', 'CompB']
          }
        });
      }, 1500);
    });
  },

  // Workflow 2: EXECUTE (Content Agents)
  generateContent: async (endpoint: string, data: any): Promise<any> => {
    console.log(`[n8n Bridge] Routing to ${endpoint} agent...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = "";
        let model = "gpt-4o-mini";
        let cost = 0.002;

        const context = data?.context || data || {};
        const topic = context.topic || 'your topic';
        const tone = context.tone || 'Professional';

        if (endpoint === 'generate-copy') {
           content = `Here is the high-converting content for ${topic}. This leverages the ${tone} tone perfectly.`;
           model = "claude-sonnet-4.5";
           cost = 0.015;
        } else if (endpoint === 'seo-keyword-research') {
           return resolve({
             data: [
               { term: 'ai marketing tools', difficulty: 45, searchVolume: 12000 },
               { term: 'automated copywriting', difficulty: 30, searchVolume: 5000 },
               { term: 'generative ai for business', difficulty: 65, searchVolume: 22000 },
             ],
             modelUsed: 'gemini-pro'
           });
        } else if (endpoint === 'generate-social-post') {
            const safeTopic = String(topic).replace(/\s/g, '');
            content = `🚀 Transform your workflow with AI! #${safeTopic} #Innovation`;
            model = "gpt-4o";
        }

        resolve({
          content,
          modelUsed: model,
          cost: cost,
          usage: { input_tokens: 500, output_tokens: 200 }
        });
      }, 2000); 
    });
  },

  // Workflow 3: VERIFY
  triggerVerifyPhase: async (data: any): Promise<any> => {
    console.log("[n8n Bridge] Triggering VERIFY Logic...");
    return new Promise((resolve) => {
      setTimeout(() => {
        const pass = Math.random() > 0.3; 
        resolve({
          success: true,
          pass: pass,
          verifications: [
            { type: 'brand_voice', score: pass ? 95 : 65, issues: pass ? [] : ['Tone too aggressive'] },
            { type: 'seo_compliance', score: 88, issues: [] },
            { type: 'factual_accuracy', score: 100, issues: [] }
          ],
          variantsGenerated: pass ? 3 : 0
        });
      }, 2000);
    });
  }
};
