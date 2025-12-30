
export type CampaignStatus = 
  | 'draft' 
  | 'observe' 
  | 'execute' 
  | 'verify' 
  | 'validate' 
  | 'published' 
  | 'completed';

export interface Campaign {
  id: string;
  name: string;
  client_id: string;
  status: CampaignStatus;
  brief: {
    objective: string;
    topic: string;
    industry: string;
    targetAudience: string;
  };
  created_at: string;
  metrics?: {
    roi: number;
    impressions: number;
    clicks: number;
  };
  content?: {
    type: string;
    body: string;
    model: string;
  }[];
}

export interface AgentTask {
  type: string;
  context: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata: {
    agent: string;
    executionTime: number;
    modelUsed?: string;
    cost?: number;
    toolsUsed?: string[]; // New field for integration tracking
  };
}

export interface DashboardStats {
  activeCampaigns: number;
  totalGeneratedContent: number;
  avgRoi: number;
  creditsUsed: number;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Intelligence' | 'SEO' | 'Social' | 'Analytics' | 'Design' | 'Email';
  description: string;
  pricing: string;
  status: 'connected' | 'disconnected' | 'error';
  icon: string;
}
