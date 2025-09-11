// Enterprise Configuration Types
// This defines the structure for enterprise customization

export interface EnterpriseInfo {
  name: string;
  industry: string;
  description: string;
  headquarters: string;
  website: string;
  supportHours: string;
  languages: string[];
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
    chat?: string;
  };
}

export interface APIConfig {
  name: string;
  description: string;
  baseUrl?: string;
  endpoints: APIEndpoint[];
  authentication?: {
    type: 'api_key' | 'oauth' | 'basic' | 'bearer';
    header?: string;
    parameter?: string;
  };
}

export interface APIEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: APIParameter[];
  responseFormat: string;
  voiceResponseTemplate?: string;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'array';
  required: boolean;
  description: string;
  example?: string;
}

export interface KnowledgeBaseConfig {
  name: string;
  description: string;
  documents: DocumentChunk[];
  categories: string[];
  searchConfig: {
    maxResults: number;
    similarityThreshold: number;
  };
}

export interface DocumentChunk {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface VoiceAgentConfig {
  name: string;
  instructions: string;
  personality: {
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    language: string;
    responseStyle: 'concise' | 'detailed' | 'conversational';
  };
  capabilities: string[];
  fallbackMessage: string;
}

export interface EnterpriseVoiceAgentConfig {
  enterprise: EnterpriseInfo;
  apis: APIConfig[];
  knowledgeBase: KnowledgeBaseConfig;
  voiceAgent: VoiceAgentConfig;
  tools: ToolConfig[];
}

export interface ToolConfig {
  name: string;
  description: string;
  type: 'api' | 'knowledge_base' | 'custom';
  config: any;
  enabled: boolean;
}

// Default configurations for different industries
export const INDUSTRY_TEMPLATES = {
  airline: {
    industry: 'Airline',
    capabilities: [
      'Flight booking and reservations',
      'Baggage policies and allowances',
      'Check-in and boarding procedures',
      'Ticket changes and cancellations',
      'Loyalty program information',
      'Special assistance services',
      'Flight status and delays',
      'Refunds and compensation'
    ],
    defaultAPIs: [
      {
        name: 'Flight Status API',
        description: 'Real-time flight information and status updates',
        endpoints: [
          {
            name: 'get_flight_status',
            path: '/flights/status',
            method: 'GET' as const,
            description: 'Get flight status by flight number or route',
            parameters: [
              { name: 'flightNumber', type: 'string' as const, required: false, description: 'Flight number' },
              { name: 'departureCity', type: 'string' as const, required: false, description: 'Departure city' },
              { name: 'arrivalCity', type: 'string' as const, required: false, description: 'Arrival city' }
            ],
            responseFormat: 'JSON',
            voiceResponseTemplate: 'Flight {flightNumber} from {departureCity} to {arrivalCity} is {status}.'
          }
        ]
      }
    ]
  },
  hotel: {
    industry: 'Hotel',
    capabilities: [
      'Room booking and reservations',
      'Room availability and pricing',
      'Check-in and check-out procedures',
      'Cancellation policies',
      'Loyalty program information',
      'Special requests and amenities',
      'Room service and facilities',
      'Billing and payment information'
    ]
  },
  bank: {
    industry: 'Banking',
    capabilities: [
      'Account balance inquiries',
      'Transaction history',
      'Transfer and payment services',
      'Loan and credit information',
      'Investment services',
      'Card management',
      'Fraud protection',
      'Branch and ATM locations'
    ]
  },
  retail: {
    industry: 'Retail',
    capabilities: [
      'Product information and availability',
      'Order status and tracking',
      'Returns and exchanges',
      'Loyalty program benefits',
      'Shipping and delivery',
      'Payment and billing',
      'Customer support',
      'Store locations and hours'
    ]
  }
};
