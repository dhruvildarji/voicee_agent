import { useState, useEffect } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime'
import { EnterpriseFileLoader } from './framework/EnterpriseFileLoader'
import { EnterpriseSetupWizard } from './framework/EnterpriseSetupWizard'
import { LandingPage } from './components/LandingPage'
import { VoiceProviderToggle } from './components/VoiceProviderToggle'
import { useVapiEnterprise } from './hooks/useVapiEnterprise'
import './App.css'

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [setupMode, setSetupMode] = useState(false)
  const [useFileLoader, setUseFileLoader] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [, setEphemeralToken] = useState('')
  const [enterpriseConfig, setEnterpriseConfig] = useState<EnterpriseVoiceAgentConfig | null>(null)
  const [session, setSession] = useState<RealtimeSession | null>(null)
  const [status, setStatus] = useState('Disconnected')

  // Vapi configuration
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'vapi'>('openai')
  const vapiPublicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
  const vapiAssistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID
  const vapiBaseUrl = import.meta.env.VITE_VAPI_BASE_URL // Don't set default, let Vapi SDK handle it

  // Vapi hook - only initialize if we have the required config
  const vapiConfig = vapiPublicKey && vapiAssistantId ? {
    publicKey: vapiPublicKey,
    assistantId: vapiAssistantId,
    baseUrl: vapiBaseUrl,
    enterpriseConfig
  } : null

  const {
    isConnected: vapiConnected,
    isConnecting: vapiConnecting,
    status: vapiStatus,
    connect: vapiConnect,
    disconnect: vapiDisconnect
  } = useVapiEnterprise(vapiConfig || {
    publicKey: '',
    assistantId: '',
    baseUrl: vapiBaseUrl,
    enterpriseConfig: null
  })

  // Debug: Log component initialization
  console.log('🚀 App component initialized')
  console.log('📊 Current state:', { setupMode, useFileLoader, isConnected })

  const handleConfigComplete = (config: EnterpriseVoiceAgentConfig) => {
    setEnterpriseConfig(config)
    setSetupMode(false)
    console.log('✅ Enterprise configuration completed:', config.enterprise.name)
  }

  const handleConfigLoaded = (config: EnterpriseVoiceAgentConfig) => {
    setEnterpriseConfig(config)
    setSetupMode(false)
    console.log('✅ Enterprise configuration loaded from file:', config.enterprise.name)
  }

  const generateEphemeralToken = async () => {
    try {
      console.log('🔑 Generating ephemeral token from backend...')
      setStatus('Generating ephemeral token...')

      const response = await fetch('/api/token', { method: 'POST' })

      const data = await response.json()

      console.log('🔧 Data:', data)
      setEphemeralToken(data.value)
      console.log('✅ Ephemeral token generated successfully')
      setStatus('Ephemeral token ready')
      
      return data.value
    } catch (error) {
      console.error('❌ Error generating ephemeral token:', error)
      setStatus('Failed to generate token')
      alert(`Failed to generate ephemeral token: ${(error as Error).message}`)
      throw error
    }
  }

  const connectToVoiceAgent = async () => {
    if (!enterpriseConfig) {
      alert('Please complete the enterprise configuration first')
      return
    }

    if (selectedProvider === 'openai') {
      await connectToOpenAI()
    } else if (selectedProvider === 'vapi') {
      await connectToVapi()
    }
  }

  const connectToOpenAI = async () => {
    setIsConnecting(true)
    setStatus('Connecting...')

    try {
      console.log('🔌 Connecting to OpenAI Realtime API...')
      console.log('📋 Enterprise:', enterpriseConfig?.enterprise.name)
      console.log('🛠️ APIs configured:', enterpriseConfig?.apis?.length || 0)
      console.log('📚 Knowledge base documents:', enterpriseConfig?.knowledgeBase?.documents?.length || 0)

      // Generate ephemeral token automatically
      const token = await generateEphemeralToken()

      console.log('🔧 Creating RealtimeAgent...')
      // Create agent with dynamic configuration
      const agent = new RealtimeAgent({
        name: enterpriseConfig?.voiceAgent?.name || 'Enterprise Assistant',
        instructions: enterpriseConfig?.voiceAgent?.instructions || 'You are a helpful assistant.',
        voice: 'alloy'
      })

      console.log('🤖 Agent created successfully')

      console.log('🔧 Creating RealtimeSession...')
      // Create session with model specification
      const session = new RealtimeSession(agent, {
        model: 'gpt-realtime'
      })

      console.log('📡 Session created successfully')
      setSession(session)
      setStatus('Starting session...')
      console.log('🔄 Starting RealtimeSession...')

      // Start the session with ephemeral client token
      await session.connect({ apiKey: token })
      
      setIsConnected(true)
      setStatus('Connected - Ready to speak!')
      console.log('✅ Connected to OpenAI Realtime API and session started')

    } catch (error) {
      console.error('❌ Connection failed:', error)
      setStatus('Connection failed')
      alert(`Connection failed: ${(error as Error).message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectToVapi = async () => {
    try {
      await vapiConnect()
    } catch (error) {
      console.error('❌ Vapi connection failed:', error)
      alert(`Vapi connection failed: ${(error as Error).message}`)
    }
  }

  const disconnect = () => {
    if (selectedProvider === 'openai' && session) {
      try {
        setStatus('Disconnecting...')
        console.log('🔌 Disconnecting from OpenAI Realtime API...')
        
        setSession(null)
        setIsConnected(false)
        setStatus('Disconnected')
        console.log('✅ Disconnected from OpenAI Realtime API')
      } catch (error) {
        console.error('❌ Error during disconnect:', error)
        setStatus('Disconnected')
        setSession(null)
        setIsConnected(false)
      }
    } else if (selectedProvider === 'vapi') {
      try {
        vapiDisconnect()
      } catch (error) {
        console.error('❌ Error during Vapi disconnect:', error)
      }
    }
  }

  const handleReconfigure = () => {
    disconnect()
    setEnterpriseConfig(null)
    setSetupMode(true)
    setShowLanding(false)
    console.log('🔄 Returning to setup mode')
  }

  const handleGetStarted = () => {
    setShowLanding(false)
    setSetupMode(true)
  }

  // Cleanup effect for session
  useEffect(() => {
    return () => {
      if (session) {
        console.log('🧹 Cleaning up session on unmount')
        // Session cleanup will happen automatically
      }
    }
  }, [session])

  // Debug: Log render decision
  console.log('🎨 Rendering:', showLanding ? 'Landing Page' : setupMode ? 'Setup Mode' : 'Main App')

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  if (setupMode) {
    return (
      <div className="setup-mode">
        <div className="setup-container">
          <div className="setup-header">
            <h1>🎤 Enterprise Voice Assistant Framework</h1>
            <p>Choose how you'd like to configure your voice assistant</p>
          </div>
          
          <div className="setup-options">
            <button
              onClick={() => setUseFileLoader(true)}
              className={`setup-option ${useFileLoader ? 'active' : ''}`}
            >
              <div className="option-icon">📁</div>
              <div className="option-title">Load from File</div>
              <div className="option-description">Upload an existing configuration JSON file</div>
            </button>
            
            <button
              onClick={() => {
                console.log('🔧 Setup Wizard clicked');
                setUseFileLoader(false);
              }}
              className={`setup-option ${!useFileLoader ? 'active' : ''}`}
            >
              <div className="option-icon">🔧</div>
              <div className="option-title">Setup Wizard</div>
              <div className="option-description">Create configuration step by step</div>
            </button>
          </div>
          
          <div className="setup-content">
            {useFileLoader ? (
              <EnterpriseFileLoader onConfigLoaded={handleConfigLoaded} />
            ) : (
              <>
                {console.log('🎨 Rendering EnterpriseSetupWizard')}
                <EnterpriseSetupWizard onConfigComplete={handleConfigComplete} />
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎤 {enterpriseConfig?.enterprise.name} Voice Assistant</h1>
        <p className="description">
          Welcome to the {enterpriseConfig?.enterprise.name} voice assistant. 
          This assistant can help you with {(enterpriseConfig?.voiceAgent?.capabilities?.join(', ') || 'various tasks').toLowerCase()}.
        </p>

        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: 0, color: '#2d5a2d' }}>✅ Configuration Loaded Successfully!</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#2d5a2d' }}>
            <li><strong>Enterprise:</strong> {enterpriseConfig?.enterprise.name}</li>
            <li><strong>Industry:</strong> {enterpriseConfig?.enterprise.industry}</li>
            <li><strong>APIs:</strong> {enterpriseConfig?.apis?.length || 0} configured</li>
            <li><strong>Knowledge Base:</strong> {enterpriseConfig?.knowledgeBase?.documents?.length || 0} documents</li>
            <li><strong>Capabilities:</strong> {enterpriseConfig?.voiceAgent?.capabilities?.length || 0} features</li>
            {enterpriseConfig?.enterprise.sipConfig?.enabled && (
              <li><strong>📞 SIP Calls:</strong> Enabled ({enterpriseConfig.enterprise.sipConfig.phoneNumber})</li>
            )}
          </ul>
        </div>

        {enterpriseConfig?.enterprise.sipConfig?.enabled && (
          <div style={{ 
            backgroundColor: '#e6f3ff', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left',
            border: '2px solid #b3d9ff'
          }}>
            <h3 style={{ marginTop: 0, color: '#2c5282' }}>📞 SIP Phone Call Integration Active!</h3>
            <p style={{ color: '#2c5282', marginBottom: '15px' }}>
              Your voice assistant is ready to receive phone calls at: <strong>{enterpriseConfig.enterprise.sipConfig.phoneNumber}</strong>
            </p>
            <div style={{ backgroundColor: '#f7fafc', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
              <h4 style={{ marginTop: 0, color: '#2d3748' }}>📋 SIP Setup Status:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#2d3748' }}>
                <li>✅ Phone number configured: {enterpriseConfig.enterprise.sipConfig.phoneNumber}</li>
                <li>✅ SIP provider: {enterpriseConfig.enterprise.sipConfig.sipProvider}</li>
                <li>✅ Voice: {enterpriseConfig.enterprise.sipConfig.voice}</li>
                <li>✅ Instructions: {enterpriseConfig.enterprise.sipConfig.instructions}</li>
                <li>⚠️ Configure SIP trunk to point to: <code>sip:proj_5n75yaXMrNWkTQUCR660jbl6@sip.api.openai.com;transport=tls</code></li>
                <li>⚠️ Set up webhook at platform.openai.com</li>
              </ul>
            </div>
            <p style={{ color: '#2c5282', fontSize: '0.9rem', margin: 0 }}>
              <strong>Next Steps:</strong> Configure your SIP provider to route calls to the OpenAI SIP endpoint, 
              and set up the webhook to receive incoming call notifications.
            </p>
          </div>
        )}

        {/* Voice Provider Toggle */}
        <VoiceProviderToggle 
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          disabled={isConnecting || isConnected || vapiConnecting || vapiConnected}
          vapiAvailable={!!(vapiPublicKey && vapiAssistantId)}
        />

        <div className="status">
          <div className={`status-indicator ${(selectedProvider === 'openai' ? isConnected : vapiConnected) ? 'connected' : 'disconnected'}`}></div>
          <span>{selectedProvider === 'openai' ? status : vapiStatus}</span>
        </div>

        {!(selectedProvider === 'openai' ? isConnected : vapiConnected) ? (
          <div className="connection-form">
            <div className="input-group">
              <p style={{ marginBottom: '20px', color: '#666' }}>
                {selectedProvider === 'openai' 
                  ? 'Click the button below to automatically generate an ephemeral token and connect to the OpenAI voice assistant.'
                  : 'Click the button below to connect to the Vapi voice assistant using your configured assistant.'
                }
              </p>
            </div>
            <button
              className="connect-button"
              onClick={connectToVoiceAgent}
              disabled={selectedProvider === 'openai' ? isConnecting : vapiConnecting}
            >
              {(selectedProvider === 'openai' ? isConnecting : vapiConnecting) ? 'Connecting...' : `Connect to ${selectedProvider === 'openai' ? 'OpenAI' : 'Vapi'} Voice Assistant`}
            </button>
          </div>
        ) : (
          <div className="voice-controls">
            <div className="voice-status">
              <div className="pulse-indicator"></div>
              <span>{selectedProvider === 'openai' ? 'OpenAI' : 'Vapi'} Voice Assistant Active - Start speaking!</span>
            </div>
            <button className="disconnect-button" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )}
          
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <button 
            onClick={handleReconfigure}
            style={{
              padding: '15px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔄 Reconfigure Enterprise Settings
          </button>
        </div>
          
        <div className="instructions">
          <h3>How to Use:</h3>
          <ol>
            <li>Make sure you have a working OpenAI API key with Realtime API access</li>
            <li>Click "Connect to Voice Assistant" to establish the connection</li>
            <li>Allow microphone access when prompted</li>
            <li>Start speaking naturally - the assistant will respond with voice</li>
            <li>The assistant can help with {enterpriseConfig?.voiceAgent?.capabilities?.join(', ').toLowerCase() || 'various tasks'}</li>
            {enterpriseConfig?.enterprise.sipConfig?.enabled && (
              <li>📞 Customers can also call {enterpriseConfig.enterprise.sipConfig.phoneNumber} to speak with the voice assistant</li>
            )}
          </ol>
          
          {enterpriseConfig?.enterprise.sipConfig?.enabled && (
            <div style={{ 
              backgroundColor: '#fff3cd', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ffeaa7'
            }}>
              <h4 style={{ marginTop: 0, color: '#856404' }}>📞 SIP Phone Call Setup:</h4>
              <ol style={{ color: '#856404', marginBottom: '10px' }}>
                <li>Purchase a phone number from your SIP provider ({enterpriseConfig.enterprise.sipConfig.sipProvider})</li>
                <li>Configure your SIP trunk to point to: <code>sip:proj_5n75yaXMrNWkTQUCR660jbl6@sip.api.openai.com;transport=tls</code></li>
                <li>Set up a webhook at platform.openai.com pointing to: <code>http://your-domain.com/api/sip/webhook</code></li>
                <li>Your voice assistant will automatically handle incoming calls</li>
              </ol>
              <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>
                <strong>Note:</strong> Replace $PROJECT_ID with your OpenAI project ID and your-domain.com with your server URL.
              </p>
            </div>
          )}
          
          <p>
            <strong>Need help?</strong> Check out the{' '}
            <a href="https://platform.openai.com/docs/guides/realtime" target="_blank" rel="noopener noreferrer">
              OpenAI Realtime API documentation
            </a>
            {' '}and{' '}
            <a href="https://platform.openai.com/docs/guides/realtime/sip" target="_blank" rel="noopener noreferrer">
              SIP integration guide
            </a>
            {' '}for more information.
          </p>
          
          <h3>Configuration Details:</h3>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <h4>Enterprise Information:</h4>
            <ul>
              <li><strong>Name:</strong> {enterpriseConfig?.enterprise.name}</li>
              <li><strong>Industry:</strong> {enterpriseConfig?.enterprise.industry}</li>
              <li><strong>Description:</strong> {enterpriseConfig?.enterprise.description}</li>
              <li><strong>Headquarters:</strong> {enterpriseConfig?.enterprise.headquarters}</li>
              <li><strong>Website:</strong> {enterpriseConfig?.enterprise.website}</li>
              <li><strong>Support Hours:</strong> {enterpriseConfig?.enterprise.supportHours}</li>
              <li><strong>Languages:</strong> {enterpriseConfig?.enterprise.languages?.join(', ')}</li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <h4>Contact Information:</h4>
            <ul>
              <li><strong>Phone:</strong> {enterpriseConfig?.enterprise.contactInfo?.phone}</li>
              <li><strong>Email:</strong> {enterpriseConfig?.enterprise.contactInfo?.email}</li>
              {enterpriseConfig?.enterprise.contactInfo?.whatsapp && (
                <li><strong>WhatsApp:</strong> {enterpriseConfig.enterprise.contactInfo.whatsapp}</li>
              )}
              {enterpriseConfig?.enterprise.sipConfig?.enabled && (
                <li><strong>📞 SIP Phone:</strong> {enterpriseConfig.enterprise.sipConfig.phoneNumber}</li>
              )}
            </ul>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <h4>Voice Agent Configuration:</h4>
            <ul>
              <li><strong>Name:</strong> {enterpriseConfig?.voiceAgent?.name}</li>
              <li><strong>Personality:</strong> {enterpriseConfig?.voiceAgent?.personality?.tone}</li>
              <li><strong>Language:</strong> {enterpriseConfig?.voiceAgent?.personality?.language}</li>
              <li><strong>Response Style:</strong> {enterpriseConfig?.voiceAgent?.personality?.responseStyle}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App