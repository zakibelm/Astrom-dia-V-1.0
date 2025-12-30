
import { Integration } from '../types';

export const INTEGRATIONS: Integration[] = [
  // Research & Intelligence
  {
    id: 'apollo',
    name: 'Apollo.io',
    category: 'Intelligence',
    description: 'B2B Lead Generation & Contact Info',
    pricing: '$49/mo',
    status: 'connected',
    icon: '🎯'
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    category: 'Intelligence',
    description: 'Email Finder & Verification',
    pricing: '$49/mo',
    status: 'connected',
    icon: '📧'
  },
  {
    id: 'similarweb',
    name: 'SimilarWeb',
    category: 'Intelligence',
    description: 'Market Intelligence & Traffic Analysis',
    pricing: 'Custom',
    status: 'disconnected',
    icon: '🌐'
  },
  
  // SEO
  {
    id: 'dataforseo',
    name: 'DataForSEO',
    category: 'SEO',
    description: 'SERP Scraping & Keyword Data',
    pricing: 'Pay-as-you-go',
    status: 'connected',
    icon: '🔍'
  },
  {
    id: 'serpapi',
    name: 'SerpAPI',
    category: 'SEO',
    description: 'Real-time Search Results',
    pricing: '$50/mo',
    status: 'disconnected',
    icon: '🕷️'
  },

  // Social
  {
    id: 'brandwatch',
    name: 'Brandwatch',
    category: 'Social',
    description: 'Social Listening & Sentiment',
    pricing: 'Custom',
    status: 'disconnected',
    icon: '👂'
  },
  {
    id: 'mention',
    name: 'Mention',
    category: 'Social',
    description: 'Brand Monitoring',
    pricing: '$29/mo',
    status: 'connected',
    icon: '📢'
  },

  // Content & Design
  {
    id: 'unsplash',
    name: 'Unsplash API',
    category: 'Design',
    description: 'High-quality Stock Photos',
    pricing: 'Free',
    status: 'connected',
    icon: '🖼️'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    category: 'Email',
    description: 'Email Delivery Service',
    pricing: '$15/mo',
    status: 'connected',
    icon: '📨'
  }
];

export const IntegrationService = {
  getAll: async () => {
    return INTEGRATIONS;
  },
  
  toggleStatus: async (id: string) => {
    // Simulate API toggle
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};
