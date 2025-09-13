import React, { useState, useRef } from 'react';
import { EnterpriseConfigManager } from './EnterpriseConfigManager';
import './EnterpriseSetupWizard.css';

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

interface EnterpriseSetupWizardProps {
  onConfigComplete: (config: EnterpriseVoiceAgentConfig) => void;
}

interface FormErrors {
  [key: string]: string;
}

export const EnterpriseSetupWizard: React.FC<EnterpriseSetupWizardProps> = ({ onConfigComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [configManager] = useState(() => new EnterpriseConfigManager());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Debug logging
  console.log('🚀 EnterpriseSetupWizard component initialized');
  console.log('📊 Current step:', currentStep);
  
  const [enterpriseInfo, setEnterpriseInfo] = useState({
    name: '',
    industry: '',
    description: '',
    headquarters: '',
    website: '',
    supportHours: '24/7',
    languages: ['English'],
    phone: '+14243937267',
    email: '',
    whatsapp: '',
    chat: '',
    tone: 'professional',
    language: 'English',
    responseStyle: 'conversational',
    sipEnabled: true,
    sipPhoneNumber: '+14243937267',
    sipProvider: 'twilio',
    sipInstructions: 'You are a helpful customer support agent. Answer questions professionally and provide assistance with company services.',
    sipVoice: 'alloy'
  });

  const [apis, setApis] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploadedConfig, setUploadedConfig] = useState<any>(null);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!enterpriseInfo.name.trim()) newErrors.name = 'Company name is required';
        if (!enterpriseInfo.industry) newErrors.industry = 'Industry is required';
        if (!enterpriseInfo.description.trim()) newErrors.description = 'Description is required';
        if (enterpriseInfo.website && !validateUrl(enterpriseInfo.website)) {
          newErrors.website = 'Please enter a valid website URL';
        }
        break;
      case 2:
        if (!enterpriseInfo.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!enterpriseInfo.email.trim()) newErrors.email = 'Email is required';
        if (!validatePhone(enterpriseInfo.phone)) newErrors.phone = 'Please enter a valid phone number';
        if (!validateEmail(enterpriseInfo.email)) newErrors.email = 'Please enter a valid email address';
        if (enterpriseInfo.sipEnabled && !enterpriseInfo.sipPhoneNumber.trim()) {
          newErrors.sipPhoneNumber = 'SIP phone number is required when SIP is enabled';
        }
        if (enterpriseInfo.sipEnabled && !validatePhone(enterpriseInfo.sipPhoneNumber)) {
          newErrors.sipPhoneNumber = 'Please enter a valid SIP phone number';
        }
        break;
      case 3:
        // APIs are optional, no validation needed
        break;
      case 4:
        // Documents are optional, no validation needed
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      try {
        // Complete setup
        const config = configManager.createConfig({
          ...enterpriseInfo,
          apis,
          documents
        });
        onConfigComplete(config);
      } catch (error) {
        console.error('Error creating configuration:', error);
        alert('Error creating configuration. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          setUploadedConfig(config);
          // Auto-populate form with uploaded config
          if (config.enterprise) {
            setEnterpriseInfo({
              name: config.enterprise.name || '',
              industry: config.enterprise.industry || '',
              description: config.enterprise.description || '',
              headquarters: config.enterprise.headquarters || '',
              website: config.enterprise.website || '',
              supportHours: config.enterprise.supportHours || '24/7',
              languages: config.enterprise.languages || ['English'],
              phone: config.enterprise.contactInfo?.phone || '',
              email: config.enterprise.contactInfo?.email || '',
              whatsapp: config.enterprise.contactInfo?.whatsapp || '',
              chat: config.enterprise.contactInfo?.chat || '',
              tone: config.voiceAgent?.personality?.tone || 'professional',
              language: config.voiceAgent?.personality?.language || 'English',
              responseStyle: config.voiceAgent?.personality?.responseStyle || 'conversational',
              sipEnabled: config.enterprise.sipConfig?.enabled || false,
              sipPhoneNumber: config.enterprise.sipConfig?.phoneNumber || '',
              sipProvider: config.enterprise.sipConfig?.sipProvider || 'twilio',
              sipInstructions: config.enterprise.sipConfig?.instructions || 'You are a helpful customer support agent. Answer questions professionally and provide assistance with company services.',
              sipVoice: config.enterprise.sipConfig?.voice || 'alloy'
            });
            setApis(config.apis || []);
            setDocuments(config.knowledgeBase?.documents || []);
          }
        } catch (error) {
          alert('Invalid JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
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

  const removeAPI = (index: number) => {
    setApis(apis.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const renderStep1 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>🏢 Company Information</h2>
        <p>Tell us about your company to customize your voice assistant</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label required">Company Name</label>
          <input
            type="text"
            value={enterpriseInfo.name}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, name: e.target.value})}
            placeholder="e.g., Acme Airlines"
            className={`form-input ${errors.name ? 'error' : ''}`}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label className="form-label required">Industry</label>
          <select
            value={enterpriseInfo.industry}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, industry: e.target.value})}
            className={`form-input ${errors.industry ? 'error' : ''}`}
          >
            <option value="">Select Industry</option>
            <option value="airline">✈️ Airline</option>
            <option value="hotel">🏨 Hotel & Hospitality</option>
            <option value="bank">🏦 Banking & Finance</option>
            <option value="retail">🛍️ Retail & E-commerce</option>
            <option value="healthcare">🏥 Healthcare</option>
            <option value="telecom">📱 Telecommunications</option>
            <option value="education">🎓 Education</option>
            <option value="technology">💻 Technology</option>
            <option value="other">🔧 Other</option>
          </select>
          {errors.industry && <span className="error-message">{errors.industry}</span>}
        </div>

        <div className="form-group full-width">
          <label className="form-label required">Company Description</label>
          <textarea
            value={enterpriseInfo.description}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, description: e.target.value})}
            placeholder="Brief description of your company and services..."
            className={`form-input ${errors.description ? 'error' : ''}`}
            rows={3}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Headquarters</label>
          <input
            type="text"
            value={enterpriseInfo.headquarters}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, headquarters: e.target.value})}
            placeholder="e.g., New York, NY, USA"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Website</label>
          <input
            type="url"
            value={enterpriseInfo.website}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, website: e.target.value})}
            placeholder="https://www.yourcompany.com"
            className={`form-input ${errors.website ? 'error' : ''}`}
          />
          {errors.website && <span className="error-message">{errors.website}</span>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>📞 Contact Information</h2>
        <p>Provide contact details for customer support</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Support Hours</label>
          <input
            type="text"
            value={enterpriseInfo.supportHours}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, supportHours: e.target.value})}
            placeholder="e.g., 24/7 or 9 AM - 6 PM EST"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            value={enterpriseInfo.phone}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, phone: e.target.value})}
            placeholder="e.g., +1-800-123-4567"
            className={`form-input ${errors.phone ? 'error' : ''}`}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label required">Email Address</label>
          <input
            type="email"
            value={enterpriseInfo.email}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, email: e.target.value})}
            placeholder="support@yourcompany.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">WhatsApp (Optional)</label>
          <input
            type="text"
            value={enterpriseInfo.whatsapp}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, whatsapp: e.target.value})}
            placeholder="+1-800-123-4567"
            className="form-input"
          />
        </div>

        <div className="form-group full-width">
          <label className="form-label">Supported Languages</label>
          <input
            type="text"
            value={enterpriseInfo.languages.join(', ')}
            onChange={(e) => setEnterpriseInfo({...enterpriseInfo, languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)})}
            placeholder="English, Spanish, French, German"
            className="form-input"
          />
          <small className="form-hint">Separate multiple languages with commas</small>
        </div>

        <div className="form-group full-width">
          <div className="sip-section">
            <h3>📞 SIP Phone Call Integration</h3>
            <p>Enable customers to call your voice assistant directly via phone</p>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={enterpriseInfo.sipEnabled}
                  onChange={(e) => setEnterpriseInfo({...enterpriseInfo, sipEnabled: e.target.checked})}
                />
                Enable SIP phone calls
              </label>
            </div>

            {enterpriseInfo.sipEnabled && (
              <div className="sip-config">
                <div className="form-group">
                  <label className="form-label required">SIP Phone Number</label>
                  <input
                    type="tel"
                    value={enterpriseInfo.sipPhoneNumber}
                    onChange={(e) => setEnterpriseInfo({...enterpriseInfo, sipPhoneNumber: e.target.value})}
                    placeholder="e.g., +1-800-123-4567"
                    className={`form-input ${errors.sipPhoneNumber ? 'error' : ''}`}
                  />
                  {errors.sipPhoneNumber && <span className="error-message">{errors.sipPhoneNumber}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">SIP Provider</label>
                  <select
                    value={enterpriseInfo.sipProvider}
                    onChange={(e) => setEnterpriseInfo({...enterpriseInfo, sipProvider: e.target.value})}
                    className="form-input"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="vonage">Vonage</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Voice Assistant Instructions</label>
                  <textarea
                    value={enterpriseInfo.sipInstructions}
                    onChange={(e) => setEnterpriseInfo({...enterpriseInfo, sipInstructions: e.target.value})}
                    placeholder="Instructions for the voice assistant when handling phone calls..."
                    className="form-input"
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Voice</label>
                  <select
                    value={enterpriseInfo.sipVoice}
                    onChange={(e) => setEnterpriseInfo({...enterpriseInfo, sipVoice: e.target.value})}
                    className="form-input"
                  >
                    <option value="alloy">Alloy</option>
                    <option value="echo">Echo</option>
                    <option value="fable">Fable</option>
                    <option value="onyx">Onyx</option>
                    <option value="nova">Nova</option>
                    <option value="shimmer">Shimmer</option>
                  </select>
                </div>

                <div className="sip-info">
                  <h4>📋 SIP Setup Instructions:</h4>
                  <ol>
                    <li>Purchase a phone number from your SIP provider (Twilio, Vonage, etc.)</li>
                    <li>Configure your SIP trunk to point to: <code>sip:proj_5n75yaXMrNWkTQUCR660jbl6@sip.api.openai.com;transport=tls</code></li>
                    <li>Set up a webhook at platform.openai.com for incoming calls</li>
                    <li>Your voice assistant will automatically handle incoming calls</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>🔧 API Configuration</h2>
        <p>Configure APIs for real-time data access (optional)</p>
      </div>
      
      <div className="api-section">
        <button
          onClick={addAPI}
          className="add-button"
        >
          <span className="add-icon">+</span>
          Add API Endpoint
        </button>

        {apis.map((api, index) => (
          <div key={index} className="api-card">
            <div className="api-header">
              <h4>API {index + 1}</h4>
              <button
                onClick={() => removeAPI(index)}
                className="remove-button"
                title="Remove API"
              >
                ×
              </button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">API Name</label>
                <input
                  type="text"
                  value={api.name}
                  onChange={(e) => updateAPI(index, 'name', e.target.value)}
                  placeholder="e.g., Flight Status API"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Base URL</label>
                <input
                  type="url"
                  value={api.baseUrl}
                  onChange={(e) => updateAPI(index, 'baseUrl', e.target.value)}
                  placeholder="https://api.yourcompany.com"
                  className="form-input"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Description</label>
                <textarea
                  value={api.description}
                  onChange={(e) => updateAPI(index, 'description', e.target.value)}
                  placeholder="What this API does..."
                  className="form-input"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}

        {apis.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔌</div>
            <h3>No APIs configured</h3>
            <p>Add API endpoints to enable real-time data access for your voice assistant</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-content">
      <div className="step-header">
        <h2>📚 Knowledge Base</h2>
        <p>Add documents and information for your voice assistant (optional)</p>
      </div>
      
      <div className="knowledge-section">
        <button
          onClick={addDocument}
          className="add-button"
        >
          <span className="add-icon">+</span>
          Add Document
        </button>

        {documents.map((doc, index) => (
          <div key={index} className="document-card">
            <div className="document-header">
              <h4>Document {index + 1}</h4>
              <button
                onClick={() => removeDocument(index)}
                className="remove-button"
                title="Remove Document"
              >
                ×
              </button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => updateDocument(index, 'title', e.target.value)}
                  placeholder="e.g., Baggage Policy"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  value={doc.category}
                  onChange={(e) => updateDocument(index, 'category', e.target.value)}
                  placeholder="e.g., Policies"
                  className="form-input"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Content</label>
                <textarea
                  value={doc.content}
                  onChange={(e) => updateDocument(index, 'content', e.target.value)}
                  placeholder="Document content..."
                  className="form-input"
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}

        {documents.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No documents added</h3>
            <p>Add knowledge base documents to help your voice assistant answer customer questions</p>
          </div>
        )}
      </div>
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
    return validateStep(currentStep);
  };

  const stepTitles = [
    'Company Info',
    'Contact Details', 
    'API Setup',
    'Knowledge Base'
  ];

  return (
    <div className="enterprise-setup-wizard" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      <div className="wizard-container" style={{ maxWidth: '900px', margin: '0 auto', background: 'white', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)', overflow: 'hidden' }}>
        <div className="wizard-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px', textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '700', textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>🚀 Enterprise Voice Assistant Setup</h1>
          <p style={{ margin: '0 0 30px 0', fontSize: '1.2rem', opacity: '0.9' }}>Configure your custom voice assistant in 4 simple steps</p>
          <div style={{ color: 'white', fontSize: '14px', marginTop: '10px' }}>
            Debug: Component loaded successfully
          </div>
          
          <div className="file-upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="upload-button"
            >
              📁 Upload Existing Configuration
            </button>
            {uploadedConfig && (
              <div className="upload-success">
                ✅ Configuration loaded successfully!
              </div>
            )}
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`progress-step ${step <= currentStep ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
              >
                <div className="step-number">
                  {step < currentStep ? '✓' : step}
                </div>
                <div className="step-title">{stepTitles[step - 1]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wizard-content" style={{ padding: '40px', minHeight: '500px' }}>
          {renderCurrentStep()}
        </div>

        <div className="wizard-navigation" style={{ padding: '30px 40px', background: '#f8f9fa', borderTop: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="nav-button secondary"
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px', background: '#6c757d', color: 'white' }}
          >
            ← Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            className="nav-button primary"
            style={{ padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '8px', background: '#667eea', color: 'white' }}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Configuration...
              </>
            ) : currentStep === 4 ? (
              'Complete Setup →'
            ) : (
              'Next →'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};