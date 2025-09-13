import React, { useState } from 'react';
import './EnterpriseFileLoader.css';

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

// Define the interface locally for validation
interface EnterpriseVoiceAgentConfigInterface {
  enterprise: {
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
    };
  };
  apis: Array<{
    name: string;
    description: string;
    baseUrl: string;
    endpoints: Array<{
      name: string;
      path: string;
      method: string;
      description: string;
      parameters: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
      responseFormat: string;
    }>;
  }>;
  knowledgeBase: {
    name: string;
    description: string;
    documents: Array<{
      id: string;
      title: string;
      content: string;
      category: string;
      tags: string[];
    }>;
    categories: string[];
    searchConfig: {
      maxResults: number;
      similarityThreshold: number;
    };
  };
  voiceAgent: {
    name: string;
    instructions: string;
    personality: {
      tone: string;
      language: string;
      responseStyle: string;
    };
    capabilities: string[];
    fallbackMessage: string;
  };
  tools: any[];
}

interface EnterpriseFileLoaderProps {
  onConfigLoaded: (config: EnterpriseVoiceAgentConfig) => void;
}

export const EnterpriseFileLoader: React.FC<EnterpriseFileLoaderProps> = ({ onConfigLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleLoadConfig = async () => {
    if (!selectedFile) {
      setError('Please select a configuration file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await selectedFile.text();
      const config = JSON.parse(text) as EnterpriseVoiceAgentConfig;
      
      // Validate the configuration
      validateConfig(config);
      
      onConfigLoaded(config);
    } catch (err) {
      setError(`Failed to load configuration: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const validateConfig = (config: EnterpriseVoiceAgentConfigInterface) => {
    if (!config.enterprise) {
      throw new Error('Missing enterprise information');
    }
    if (!config.enterprise.name) {
      throw new Error('Missing enterprise name');
    }
    if (!config.voiceAgent) {
      throw new Error('Missing voice agent configuration');
    }
    if (!config.knowledgeBase) {
      throw new Error('Missing knowledge base configuration');
    }
  };

  const downloadTemplate = () => {
    const template: EnterpriseVoiceAgentConfigInterface = {
      enterprise: {
        name: "Example Company",
        industry: "Technology",
        description: "A technology company providing innovative solutions",
        headquarters: "San Francisco, CA, USA",
        website: "https://example.com",
        supportHours: "24/7",
        languages: ["English"],
        contactInfo: {
          phone: "+1-800-123-4567",
          email: "support@example.com"
        }
      },
      apis: [
        {
          name: "Customer API",
          description: "Customer information and account management",
          baseUrl: "https://api.example.com",
          endpoints: [
            {
              name: "get_customer_info",
              path: "/customers/{id}",
              method: "GET",
              description: "Get customer information by ID",
              parameters: [
                { name: "id", type: "string", required: true, description: "Customer ID" }
              ],
              responseFormat: "JSON"
            }
          ]
        }
      ],
      knowledgeBase: {
        name: "Example Knowledge Base",
        description: "Customer support knowledge base",
        documents: [
          {
            id: "policy_1",
            title: "Return Policy",
            content: "Our return policy allows returns within 30 days of purchase...",
            category: "Policies",
            tags: ["returns", "policy"]
          }
        ],
        categories: ["Policies", "Support", "Products"],
        searchConfig: {
          maxResults: 3,
          similarityThreshold: 0.7
        }
      },
      voiceAgent: {
        name: "Example Voice Assistant",
        instructions: "You are a helpful customer service representative for Example Company...",
        personality: {
          tone: "professional",
          language: "English",
          responseStyle: "conversational"
        },
        capabilities: [
          "Customer support",
          "Product information",
          "Account management",
          "Technical assistance"
        ],
        fallbackMessage: "I'm sorry, I couldn't find that information. Please contact our support team for assistance."
      },
      tools: []
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'enterprise-config-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="enterprise-file-loader">
      <div className="file-loader-header">
        <h1>🏢 Load Enterprise Configuration</h1>
        <p>Select a JSON configuration file to load your enterprise voice assistant</p>
      </div>

      <div className="file-upload-area">
        <label className="file-upload-label">
          Enterprise Configuration File:
        </label>
        
        <div className="file-drop-zone">
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="file-input"
            id="config-file-input"
          />
          <label htmlFor="config-file-input" className="file-content">
            {selectedFile ? (
              <div>
                <span className="file-icon">📄</span>
                <div className="file-name">{selectedFile.name}</div>
                <div className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</div>
              </div>
            ) : (
              <div>
                <span className="file-icon">📁</span>
                <div style={{ fontWeight: 'bold' }}>Click to select configuration file</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  or drag and drop a JSON file here
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="file-actions">
        <button
          onClick={handleLoadConfig}
          disabled={!selectedFile || isLoading}
          className="load-button"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Loading...
            </>
          ) : (
            'Load Configuration'
          )}
        </button>
        
        <button onClick={downloadTemplate} className="template-button">
          📥 Download Template
        </button>
      </div>

      <div className="info-section">
        <h3>📋 Configuration File Format</h3>
        <p>Your configuration file should be a JSON file containing:</p>
        <ul>
          <li><strong>Enterprise Information:</strong> Company name, industry, contact details</li>
          <li><strong>APIs:</strong> Your existing APIs and endpoints</li>
          <li><strong>Knowledge Base:</strong> Documents and policies</li>
          <li><strong>Voice Agent:</strong> Instructions and personality settings</li>
        </ul>
        <p className="info-tip">
          💡 <strong>Tip:</strong> Download the template above to see the exact format required.
        </p>
      </div>

      <div className="warning-section">
        <h4>🔧 Alternative Setup Methods</h4>
        <p>
          You can also create configurations using the setup wizard or by manually editing JSON files.
          This file loader is perfect for loading pre-configured enterprise setups.
        </p>
      </div>
    </div>
  );
};