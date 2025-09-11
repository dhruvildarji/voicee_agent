import React, { useState } from 'react';
import { EnterpriseConfigManager } from './EnterpriseConfigManager';
import { INDUSTRY_TEMPLATES } from './types/EnterpriseConfig';

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

interface EnterpriseSetupWizardProps {
  onConfigComplete: (config: EnterpriseVoiceAgentConfig) => void;
}

export const EnterpriseSetupWizard: React.FC<EnterpriseSetupWizardProps> = ({ onConfigComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [configManager] = useState(() => new EnterpriseConfigManager());
  const [enterpriseInfo, setEnterpriseInfo] = useState({
    name: '',
    industry: '',
    description: '',
    headquarters: '',
    website: '',
    supportHours: '24/7',
    languages: ['English'],
    phone: '',
    email: '',
    whatsapp: '',
    chat: '',
    tone: 'professional',
    language: 'English',
    responseStyle: 'conversational'
  });

  const [apis, setApis] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete setup
      const config = configManager.createConfig({
        ...enterpriseInfo,
        apis,
        documents
      });
      onConfigComplete(config);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addAPI = () => {
    setApis([...apis, {
      name: '',
      description: '',
      baseUrl: '',
      endpoints: []
    }]);
  };

  const addDocument = () => {
    setDocuments([...documents, {
      id: `doc_${documents.length + 1}`,
      title: '',
      content: '',
      category: '',
      tags: []
    }]);
  };

  const updateAPI = (index: number, field: string, value: any) => {
    const updatedApis = [...apis];
    updatedApis[index] = { ...updatedApis[index], [field]: value };
    setApis(updatedApis);
  };

  const updateDocument = (index: number, field: string, value: any) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index] = { ...updatedDocuments[index], [field]: value };
    setDocuments(updatedDocuments);
  };

  const renderStep1 = () => (
    <div>
      <h2>🏢 Enterprise Information</h2>
      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Company Name:</label>
          <input
            type="text"
            value={enterpriseInfo.name}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, name: e.target.value})}
            placeholder="e.g., Acme Airlines"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Industry:</label>
          <select
            value={enterpriseInfo.industry}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, industry: e.target.value})}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">Select Industry</option>
            <option value="airline">Airline</option>
            <option value="hotel">Hotel</option>
            <option value="bank">Banking</option>
            <option value="retail">Retail</option>
            <option value="healthcare">Healthcare</option>
            <option value="telecom">Telecommunications</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
          <textarea
            value={enterpriseInfo.description}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, description: e.target.value})}
            placeholder="Brief description of your company and services"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Headquarters:</label>
          <input
            type="text"
            value={enterpriseInfo.headquarters}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, headquarters: e.target.value})}
            placeholder="e.g., New York, NY, USA"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Website:</label>
          <input
            type="url"
            value={enterpriseInfo.website}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, website: e.target.value})}
            placeholder="https://www.yourcompany.com"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2>📞 Contact Information</h2>
      <div style={{ display: 'grid', gap: '15px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Support Hours:</label>
          <input
            type="text"
            value={enterpriseInfo.supportHours}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, supportHours: e.target.value})}
            placeholder="e.g., 24/7 or 9 AM - 6 PM EST"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number:</label>
          <input
            type="tel"
            value={enterpriseInfo.phone}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, phone: e.target.value})}
            placeholder="e.g., +1-800-123-4567"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={enterpriseInfo.email}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, email: e.target.value})}
            placeholder="support@yourcompany.com"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>WhatsApp (Optional):</label>
          <input
            type="text"
            value={enterpriseInfo.whatsapp}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, whatsapp: e.target.value})}
            placeholder="+1-800-123-4567"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Languages Supported:</label>
          <input
            type="text"
            value={enterpriseInfo.languages.join(', ')}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, languages: e.target.value.split(',').map(l => l.trim())})}
            placeholder="English, Spanish, French"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2>🔧 API Configuration</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Configure APIs that your voice assistant will use to provide real-time information.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={addAPI}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          + Add API
        </button>
      </div>

      {apis.map((api, index) => (
        <div key={index} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>API {index + 1}</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>API Name:</label>
              <input
                type="text"
                value={api.name}
                onChange={(e) => updateAPI(index, 'name', e.target.value)}
                placeholder="e.g., Flight Status API"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description:</label>
              <textarea
                value={api.description}
                onChange={(e) => updateAPI(index, 'description', e.target.value)}
                placeholder="What this API does"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Base URL:</label>
              <input
                type="url"
                value={api.baseUrl}
                onChange={(e) => updateAPI(index, 'baseUrl', e.target.value)}
                placeholder="https://api.yourcompany.com"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>
        </div>
      ))}

      {apis.length === 0 && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          No APIs configured yet. Click "Add API" to get started.
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2>📚 Knowledge Base</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Add documents and information that your voice assistant can reference to answer customer questions.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={addDocument}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          + Add Document
        </button>
      </div>

      {documents.map((doc, index) => (
        <div key={index} style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '15px', 
          marginBottom: '15px',
          backgroundColor: '#f9f9f9'
        }}>
          <h4>Document {index + 1}</h4>
          <div style={{ display: 'grid', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title:</label>
              <input
                type="text"
                value={doc.title}
                onChange={(e) => updateDocument(index, 'title', e.target.value)}
                placeholder="e.g., Baggage Policy"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category:</label>
              <input
                type="text"
                value={doc.category}
                onChange={(e) => updateDocument(index, 'category', e.target.value)}
                placeholder="e.g., Policies"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content:</label>
              <textarea
                value={doc.content}
                onChange={(e) => updateDocument(index, 'content', e.target.value)}
                placeholder="Document content..."
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
              />
            </div>
          </div>
        </div>
      ))}

      {documents.length === 0 && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e9ecef', 
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          No documents added yet. Click "Add Document" to get started.
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return enterpriseInfo.name && enterpriseInfo.industry && enterpriseInfo.description;
      case 2:
        return enterpriseInfo.phone && enterpriseInfo.email;
      case 3:
        return true; // APIs are optional
      case 4:
        return true; // Documents are optional
      default:
        return false;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>🚀 Enterprise Voice Assistant Setup</h1>
        <p style={{ color: '#666' }}>
          Configure your custom voice assistant in 4 simple steps
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: step <= currentStep ? '#007bff' : '#e9ecef',
                color: step <= currentStep ? 'white' : '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        {renderCurrentStep()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          style={{
            padding: '12px 24px',
            backgroundColor: currentStep === 1 ? '#e9ecef' : '#6c757d',
            color: currentStep === 1 ? '#666' : 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          style={{
            padding: '12px 24px',
            backgroundColor: isStepValid() ? '#007bff' : '#e9ecef',
            color: isStepValid() ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            cursor: isStepValid() ? 'pointer' : 'not-allowed'
          }}
        >
          {currentStep === 4 ? 'Complete Setup' : 'Next'}
        </button>
      </div>
    </div>
  );
};
