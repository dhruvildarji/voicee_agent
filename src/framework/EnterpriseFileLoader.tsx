import React, { useState } from 'react';

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
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '40px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>🏢 Load Enterprise Configuration</h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Select a JSON configuration file to load your enterprise voice assistant
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontWeight: 'bold',
          color: '#333'
        }}>
          Enterprise Configuration File:
        </label>
        
        <div style={{ 
          border: '2px dashed #ddd', 
          borderRadius: '8px', 
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          transition: 'border-color 0.3s'
        }}>
          <input
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="config-file-input"
          />
          <label 
            htmlFor="config-file-input"
            style={{
              cursor: 'pointer',
              display: 'block',
              padding: '20px',
              color: '#666'
            }}
          >
            {selectedFile ? (
              <div>
                <div style={{ fontSize: '18px', marginBottom: '8px' }}>📄</div>
                <div style={{ fontWeight: 'bold', color: '#007bff' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>📁</div>
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
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button
          onClick={handleLoadConfig}
          disabled={!selectedFile || isLoading}
          style={{
            flex: 1,
            padding: '12px 24px',
            backgroundColor: selectedFile && !isLoading ? '#007bff' : '#e9ecef',
            color: selectedFile && !isLoading ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedFile && !isLoading ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Loading...' : 'Load Configuration'}
        </button>
        
        <button
          onClick={downloadTemplate}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          📥 Download Template
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#e8f4fd', 
        padding: '20px', 
        borderRadius: '8px',
        border: '1px solid #b8daff'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#004085' }}>📋 Configuration File Format</h3>
        <p style={{ margin: '0 0 10px 0', color: '#004085' }}>
          Your configuration file should be a JSON file containing:
        </p>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#004085' }}>
          <li><strong>Enterprise Information:</strong> Company name, industry, contact details</li>
          <li><strong>APIs:</strong> Your existing APIs and endpoints</li>
          <li><strong>Knowledge Base:</strong> Documents and policies</li>
          <li><strong>Voice Agent:</strong> Instructions and personality settings</li>
        </ul>
        <p style={{ margin: '10px 0 0 0', color: '#004085', fontSize: '14px' }}>
          💡 <strong>Tip:</strong> Download the template above to see the exact format required.
        </p>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '1px solid #ffeaa7'
      }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#856404' }}>🔧 Alternative Setup Methods</h4>
        <p style={{ margin: '0', color: '#856404', fontSize: '14px' }}>
          You can also create configurations using the setup wizard or by manually editing JSON files.
          This file loader is perfect for loading pre-configured enterprise setups.
        </p>
      </div>
    </div>
  );
};