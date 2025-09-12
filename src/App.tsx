import { useState, useEffect } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents-realtime'
import { EnterpriseFileLoader } from './framework/EnterpriseFileLoader'
import { EnterpriseSetupWizard } from './framework/EnterpriseSetupWizard'
import './App.css'

// Use any type to avoid complex type conflicts
type EnterpriseVoiceAgentConfig = any;

function App() {
  const [setupMode, setSetupMode] = useState(true)
  const [useFileLoader, setUseFileLoader] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [ephemeralToken, setEphemeralToken] = useState('')
  const [enterpriseConfig, setEnterpriseConfig] = useState<EnterpriseVoiceAgentConfig | null>(null)
  const [session, setSession] = useState<RealtimeSession | null>(null)
  const [status, setStatus] = useState('Disconnected')
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

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
      
      // const response = await fetch('http://localhost:3001/api/generate-ephemeral-token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })
      // console.log('🔧 Response:', response)
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   throw new Error(errorData.error || 'Failed to generate ephemeral token')
      // }

      // const data = await response.json()

      const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session: {
            type: 'realtime',
            model: 'gpt-realtime'
          }
        })
      });

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

    setIsConnecting(true)
    setStatus('Connecting...')

    try {
      console.log('🔌 Connecting to OpenAI Realtime API...')
      console.log('📋 Enterprise:', enterpriseConfig.enterprise.name)
      console.log('🛠️ APIs configured:', enterpriseConfig.apis?.length || 0)
      console.log('📚 Knowledge base documents:', enterpriseConfig.knowledgeBase?.documents?.length || 0)

      // Generate ephemeral token automatically
      const token = await generateEphemeralToken()

      console.log('🔧 Creating RealtimeAgent...')
      // Create agent with dynamic configuration
      const agent = new RealtimeAgent({
        name: enterpriseConfig.voiceAgent?.name || 'Enterprise Assistant',
        instructions: enterpriseConfig.voiceAgent?.instructions || 'You are a helpful assistant.',
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

  const disconnect = () => {
    if (session) {
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
    }
  }

  const handleReconfigure = () => {
    disconnect()
    setEnterpriseConfig(null)
    setSetupMode(true)
    console.log('🔄 Returning to setup mode')
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
  console.log('🎨 Rendering:', setupMode ? 'Setup Mode' : 'Main App')

  if (setupMode) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: 'white', marginBottom: '10px', fontSize: '2.5rem' }}>
              🎤 Enterprise Voice Assistant Framework
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem' }}>
              Choose how you'd like to configure your voice assistant
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            marginBottom: '30px'
          }}>
            <button
              onClick={() => setUseFileLoader(true)}
              style={{
                padding: '20px 30px',
                backgroundColor: useFileLoader ? '#007bff' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                minWidth: '200px'
              }}
            >
              📁 Load from File
            </button>
            
            <button
              onClick={() => setUseFileLoader(false)}
              style={{
                padding: '20px 30px',
                backgroundColor: !useFileLoader ? '#28a745' : 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                minWidth: '200px'
              }}
            >
              🔧 Setup Wizard
            </button>
          </div>
          
          {useFileLoader ? (
            <EnterpriseFileLoader onConfigLoaded={handleConfigLoaded} />
          ) : (
            <EnterpriseSetupWizard onConfigComplete={handleConfigComplete} />
          )}
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
          This assistant can help you with {enterpriseConfig?.voiceAgent.capabilities?.join(', ').toLowerCase() || 'various tasks'}.
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
          </ul>
        </div>

        <div className="status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{status}</span>
        </div>

        {!isConnected ? (
          <div className="connection-form">
            <div className="input-group">
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Click the button below to automatically generate an ephemeral token and connect to the voice assistant.
              </p>
            </div>
            <button
              className="connect-button"
              onClick={connectToVoiceAgent}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect to Voice Assistant'}
            </button>
          </div>
        ) : (
          <div className="voice-controls">
            <div className="voice-status">
              <div className="pulse-indicator"></div>
              <span>Voice Assistant Active - Start speaking!</span>
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
          </ol>
          <p>
            <strong>Need help?</strong> Check out the{' '}
            <a href="https://platform.openai.com/docs/guides/realtime" target="_blank" rel="noopener noreferrer">
              OpenAI Realtime API documentation
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