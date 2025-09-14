import React from 'react';
import { VapiButton } from './VapiButton';

interface VapiTestComponentProps {
  publicKey?: string;
  assistantId?: string;
  baseUrl?: string;
}

export const VapiTestComponent: React.FC<VapiTestComponentProps> = ({
  publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY,
  assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID,
  baseUrl = import.meta.env.VITE_VAPI_BASE_URL || 'https://api.vapi.ai',
}) => {
  if (!publicKey || !assistantId) {
    return (
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        color: '#92400e'
      }}>
        <strong>⚠️ Vapi Configuration Missing</strong>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          To test Vapi integration, please set the following environment variables:
        </p>
        <ul style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          <li><code>VITE_VAPI_PUBLIC_KEY</code> - Your Vapi public key</li>
          <li><code>VITE_VAPI_ASSISTANT_ID</code> - Your Vapi assistant ID</li>
        </ul>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px' }}>
          You can get these from your <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer">Vapi dashboard</a>.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, color: '#0c4a6e' }}>🧪 Vapi Integration Test</h3>
      <p style={{ color: '#0c4a6e', marginBottom: '15px' }}>
        This is a standalone test of the Vapi integration. Click the button below to start a voice conversation with Vapi.
      </p>
      
      <VapiButton 
        publicKey={publicKey}
        assistantId={assistantId}
        baseUrl={baseUrl}
        style={{
          backgroundColor: '#0ea5e9',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Test Vapi Voice Assistant
      </VapiButton>
      
      <div style={{ marginTop: '15px', fontSize: '14px', color: '#0c4a6e' }}>
        <strong>Configuration:</strong>
        <ul style={{ margin: '5px 0 0 0' }}>
          <li>Public Key: {publicKey?.substring(0, 10)}...</li>
          <li>Assistant ID: {assistantId}</li>
          <li>Base URL: {baseUrl}</li>
        </ul>
      </div>
    </div>
  );
};
