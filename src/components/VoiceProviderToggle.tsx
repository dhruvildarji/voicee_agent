import React from 'react';

interface VoiceProviderToggleProps {
  selectedProvider: 'openai' | 'vapi';
  onProviderChange: (provider: 'openai' | 'vapi') => void;
  disabled?: boolean;
  vapiAvailable?: boolean;
}

export const VoiceProviderToggle: React.FC<VoiceProviderToggleProps> = ({
  selectedProvider,
  onProviderChange,
  disabled = false,
  vapiAvailable = true,
}) => {
  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      textAlign: 'center'
    }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>🎤 Choose Voice Provider</h4>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => !disabled && onProviderChange('openai')}
          disabled={disabled}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '2px solid',
            backgroundColor: selectedProvider === 'openai' ? '#007bff' : 'white',
            color: selectedProvider === 'openai' ? 'white' : '#007bff',
            borderColor: '#007bff',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          🤖 OpenAI
        </button>
        
        <button
          onClick={() => !disabled && vapiAvailable && onProviderChange('vapi')}
          disabled={disabled || !vapiAvailable}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '2px solid',
            backgroundColor: selectedProvider === 'vapi' ? '#28a745' : 'white',
            color: selectedProvider === 'vapi' ? 'white' : '#28a745',
            borderColor: '#28a745',
            cursor: (disabled || !vapiAvailable) ? 'not-allowed' : 'pointer',
            opacity: (disabled || !vapiAvailable) ? 0.6 : 1,
            fontWeight: 'bold',
            fontSize: '14px'
          }}
          title={!vapiAvailable ? 'Vapi not configured - missing API keys' : ''}
        >
          ⚡ Vapi {!vapiAvailable && '(Not Available)'}
        </button>
      </div>
      
      <p style={{ 
        margin: '10px 0 0 0', 
        fontSize: '12px', 
        color: '#6c757d',
        fontStyle: 'italic'
      }}>
        {selectedProvider === 'openai' 
          ? 'Using OpenAI Realtime API with your enterprise configuration'
          : vapiAvailable 
            ? 'Using Vapi API with your enterprise configuration'
            : 'Vapi not available - please configure VAPI_PUBLIC_KEY and VAPI_ASSISTANT_ID in your .env file'
        }
      </p>
    </div>
  );
};
