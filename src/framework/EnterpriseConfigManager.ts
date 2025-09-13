import { INDUSTRY_TEMPLATES } from './types/EnterpriseConfig';

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

export class EnterpriseConfigManager {
  private config: EnterpriseVoiceAgentConfig | null = null;

  /**
   * Load enterprise configuration from a file or object
   */
  loadConfig(config: EnterpriseVoiceAgentConfig): void {
    this.config = config;
    this.validateConfig();
  }

  /**
   * Create a new enterprise configuration from scratch
   */
  createConfig(enterpriseInfo: any): EnterpriseVoiceAgentConfig {
    const template = INDUSTRY_TEMPLATES[enterpriseInfo.industry as keyof typeof INDUSTRY_TEMPLATES] || INDUSTRY_TEMPLATES.retail;
    
    const config: EnterpriseVoiceAgentConfig = {
      enterprise: {
        name: enterpriseInfo.name,
        industry: enterpriseInfo.industry,
        description: enterpriseInfo.description,
        headquarters: enterpriseInfo.headquarters,
        website: enterpriseInfo.website,
        supportHours: enterpriseInfo.supportHours || '24/7',
        languages: enterpriseInfo.languages || ['English'],
        contactInfo: {
          phone: enterpriseInfo.phone,
          email: enterpriseInfo.email,
          whatsapp: enterpriseInfo.whatsapp,
          chat: enterpriseInfo.chat
        },
        sipConfig: enterpriseInfo.sipEnabled ? {
          enabled: enterpriseInfo.sipEnabled,
          phoneNumber: enterpriseInfo.sipPhoneNumber,
          sipProvider: enterpriseInfo.sipProvider,
          sipUri: `sip:${process.env.OPENAI_PROJECT_ID || 'PROJECT_ID'}@sip.api.openai.com;transport=tls`,
          webhookUrl: `${process.env.SERVER_URL || 'https://your-domain.com'}/api/sip/webhook`,
          projectId: process.env.OPENAI_PROJECT_ID || 'PROJECT_ID',
          instructions: enterpriseInfo.sipInstructions,
          voice: enterpriseInfo.sipVoice
        } : undefined
      },
      apis: enterpriseInfo.apis || [],
      knowledgeBase: {
        name: `${enterpriseInfo.name} Knowledge Base`,
        description: `Customer support knowledge base for ${enterpriseInfo.name}`,
        documents: enterpriseInfo.documents || [],
        categories: enterpriseInfo.categories || [],
        searchConfig: {
          maxResults: 3,
          similarityThreshold: 0.7
        }
      },
      voiceAgent: {
        name: `${enterpriseInfo.name} Voice Assistant`,
        instructions: this.generateInstructions(enterpriseInfo, template),
        personality: {
          tone: enterpriseInfo.tone || 'professional',
          language: enterpriseInfo.language || 'English',
          responseStyle: enterpriseInfo.responseStyle || 'conversational'
        },
        capabilities: template.capabilities,
        fallbackMessage: `I'm sorry, I couldn't find that information. Please contact our support team at ${enterpriseInfo.phone} for assistance.`
      },
      tools: []
    };

    this.config = config;
    return config;
  }

  /**
   * Get the current configuration
   */
  getConfig(): EnterpriseVoiceAgentConfig | null {
    return this.config;
  }

  /**
   * Update enterprise information
   */
  updateEnterpriseInfo(info: Partial<any>): void {
    if (!this.config) throw new Error('No configuration loaded');
    
    this.config.enterprise = { ...this.config.enterprise, ...info };
  }

  /**
   * Add an API configuration
   */
  addAPI(apiConfig: any): void {
    if (!this.config) throw new Error('No configuration loaded');
    
    this.config.apis.push(apiConfig);
  }

  /**
   * Add a knowledge base document
   */
  addDocument(document: any): void {
    if (!this.config) throw new Error('No configuration loaded');
    
    this.config.knowledgeBase.documents.push(document);
  }

  /**
   * Generate voice agent instructions based on enterprise info
   */
  private generateInstructions(enterpriseInfo: any, template: any): string {
    let instructions = `You are a helpful customer service representative for ${enterpriseInfo.name}. You can help customers with:

${template.capabilities.map((cap: string) => `- ${cap}`).join('\n')}

When customers ask questions, use the available tools to get accurate information. Be friendly, professional, and helpful. If you need to look up information, let the customer know you're checking our systems for them.

For urgent matters or complex issues, always offer to connect them with our support team at ${enterpriseInfo.phone}.`;

    // Add SIP-specific instructions if enabled
    if (enterpriseInfo.sipEnabled) {
      instructions += `

📞 Phone Call Instructions:
You are now handling a phone call from a customer. Be especially attentive to:
- Speak clearly and at a comfortable pace
- Ask clarifying questions if the customer's request is unclear
- Offer to transfer them to a human agent if needed
- Provide your phone number (${enterpriseInfo.sipPhoneNumber}) for future reference
- Thank them for calling ${enterpriseInfo.name}`;
    }

    return instructions;
  }

  /**
   * Validate the configuration
   */
  private validateConfig(): void {
    if (!this.config) throw new Error('No configuration loaded');

    const required = ['enterprise', 'knowledgeBase', 'voiceAgent'];
    for (const field of required) {
      if (!this.config[field as keyof EnterpriseVoiceAgentConfig]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate enterprise info
    const enterpriseRequired = ['name', 'industry', 'contactInfo'];
    for (const field of enterpriseRequired) {
      if (!this.config.enterprise[field as keyof typeof this.config.enterprise]) {
        throw new Error(`Missing required enterprise field: ${field}`);
      }
    }
  }

  /**
   * Export configuration to JSON
   */
  exportConfig(): string {
    if (!this.config) throw new Error('No configuration loaded');
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import configuration from JSON
   */
  importConfig(jsonConfig: string): void {
    try {
      const config = JSON.parse(jsonConfig);
      this.loadConfig(config);
    } catch (error) {
      throw new Error('Invalid JSON configuration');
    }
  }

  /**
   * Get configuration summary
   */
  getConfigSummary(): any {
    if (!this.config) return null;

    return {
      enterprise: this.config.enterprise.name,
      industry: this.config.enterprise.industry,
      apis: this.config.apis.length,
      documents: this.config.knowledgeBase.documents.length,
      capabilities: this.config.voiceAgent.capabilities.length,
      tools: this.config.tools.length,
      sipEnabled: this.config.enterprise.sipConfig?.enabled || false,
      sipPhoneNumber: this.config.enterprise.sipConfig?.phoneNumber || null
    };
  }
}
