import { useState, useCallback, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import type { CreateAssistantDTO } from '@vapi-ai/web/dist/api';

interface VapiEnterpriseConfig {
  publicKey: string;
  assistantId: string;
  baseUrl?: string;
  enterpriseConfig?: any; // Your enterprise configuration
}

interface VapiEnterpriseState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  status: string;
}

export const useVapiEnterprise = (config: VapiEnterpriseConfig | null) => {
  const [state, setState] = useState<VapiEnterpriseState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    status: 'Disconnected',
  });

  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);

  // Initialize Vapi instance
  useEffect(() => {
    if (!config || !config.publicKey || !config.assistantId) {
      console.log('⚠️ Vapi config incomplete, skipping initialization');
      setState(prev => ({ 
        ...prev, 
        status: 'Vapi not configured',
        error: null
      }));
      return;
    }

    console.log('🔧 Initializing Vapi Enterprise instance...');
    console.log('🔧 Config:', {
      publicKey: config.publicKey ? `${config.publicKey.substring(0, 10)}...` : 'NOT SET',
      assistantId: config.assistantId,
      baseUrl: config.baseUrl
    });
    
    try {
      // Try different initialization approaches
      let vapi;
      
      if (config.baseUrl) {
        console.log('🔧 Creating Vapi with custom base URL:', config.baseUrl);
        vapi = new Vapi(config.publicKey, config.baseUrl);
      } else {
        console.log('🔧 Creating Vapi with default base URL');
        vapi = new Vapi(config.publicKey);
      }
      
      console.log('✅ Vapi instance created successfully');
      console.log('🔧 Vapi instance details:', {
        publicKey: config.publicKey ? `${config.publicKey.substring(0, 10)}...` : 'NOT SET',
        baseUrl: config.baseUrl || 'default',
        assistantId: config.assistantId
      });
      
      setVapiInstance(vapi);

      const handleCallStart = () => {
        console.log('📞 Vapi Enterprise call started');
        setState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isConnecting: false,
          status: 'Connected - Ready to speak!'
        }));
      };

      const handleCallEnd = () => {
        console.log('📞 Vapi Enterprise call ended');
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          isConnecting: false,
          status: 'Disconnected'
        }));
      };

      const handleError = async (error: any) => {
        console.error('❌ Vapi Enterprise error:', error);
        console.error('❌ Error details:', {
          type: error?.type,
          stage: error?.stage,
          message: error?.message,
          error: error?.error,
          totalDuration: error?.totalDuration,
          timestamp: error?.timestamp
        });
        
        let errorMessage = 'Unknown error occurred';
        if (error?.type === 'start-method-error') {
          errorMessage = `Start method error: ${error?.stage || 'unknown stage'}`;
          if (error?.error?.status) {
            errorMessage += ` (HTTP ${error.error.status})`;
          }
          
          // Try to get more details from the Response object
          if (error?.error && typeof error.error.text === 'function') {
            try {
              // Clone the response to avoid "body stream already read" error
              const clonedResponse = error.error.clone();
              const responseText = await clonedResponse.text();
              console.error('❌ HTTP Response body:', responseText);
              errorMessage += ` - ${responseText}`;
            } catch (e) {
              console.error('❌ Could not read response body:', e);
              // Try to get status and statusText instead
              if (error?.error?.status) {
                errorMessage += ` (HTTP ${error.error.status}: ${error.error.statusText || 'Unknown error'})`;
              }
            }
          }
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.toString) {
          errorMessage = error.toString();
        }
        
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isConnecting: false,
          status: 'Connection failed'
        }));
      };

      vapi.on('call-start', handleCallStart);
      vapi.on('call-end', handleCallEnd);
      vapi.on('error', handleError);

      return () => {
        console.log('🧹 Cleaning up Vapi Enterprise event listeners');
        vapi.off('call-start', handleCallStart);
        vapi.off('call-end', handleCallEnd);
        vapi.off('error', handleError);
      };
    } catch (initError) {
      console.error('❌ Failed to create Vapi instance:', initError);
      setState(prev => ({ 
        ...prev, 
        error: `Failed to initialize Vapi: ${initError}`,
        status: 'Initialization failed'
      }));
    }
  }, [config?.publicKey, config?.assistantId, config?.baseUrl]);

  const connect = useCallback(async () => {
    // Validate configuration
    if (!config || !config.publicKey) {
      const errorMsg = 'Vapi public key not provided';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!config.assistantId) {
      const errorMsg = 'Vapi assistant ID not provided';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    if (!vapiInstance) {
      const errorMsg = 'Vapi instance not initialized';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Check if already connected by trying to get the daily call object
    const dailyCall = vapiInstance.getDailyCallObject();
    if (dailyCall && dailyCall.participants().local?.audio) {
      console.log('⚠️ Vapi instance is already started');
      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false,
        status: 'Already connected'
      }));
      return;
    }

    console.log('🔌 Connecting to Vapi Enterprise...');
    console.log('🔑 Public Key:', config.publicKey ? `${config.publicKey.substring(0, 10)}...` : 'NOT SET');
    console.log('🆔 Assistant ID:', config.assistantId);
    console.log('🌐 Base URL:', config.baseUrl);
    console.log('📋 Enterprise:', config.enterpriseConfig?.enterprise?.name);
    console.log('🛠️ APIs configured:', config.enterpriseConfig?.apis?.length || 0);
    console.log('📚 Knowledge base documents:', config.enterpriseConfig?.knowledgeBase?.documents?.length || 0);

    setState(prev => ({ 
      ...prev, 
      isConnecting: true, 
      error: null,
      status: 'Connecting to Vapi...'
    }));

    try {
      console.log('🚀 Starting Vapi call with assistant ID:', config.assistantId);
      
      // Check microphone permissions first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('🎤 Microphone access granted');
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      } catch (micError) {
        console.error('❌ Microphone access denied:', micError);
        throw new Error('Microphone access is required for voice calls. Please allow microphone access and try again.');
      }
      
      // Check current state before starting
      const currentDailyCall = vapiInstance.getDailyCallObject();
      console.log('🔧 Vapi instance state before start:', {
        hasDailyCall: !!currentDailyCall,
        participants: currentDailyCall?.participants() || 'no call'
      });
      
      // Start the call with timeout - try different approaches
      let startPromise;
      
      // Skip Method 1 and go directly to Method 2 for smart assistant
      console.log('🔧 Creating smart assistant with dynamic instructions...');
      
      // Method 2: Try with assistant object (CreateAssistantDTO format) - Direct approach
      try {
          console.log('🔧 Trying method 2: assistant object');
          
          // Build dynamic instructions based on enterprise config
          const systemInstructions = config.enterpriseConfig?.voiceAgent?.instructions || 'You are a helpful assistant.';
          const enterpriseName = config.enterpriseConfig?.enterprise?.name || 'Enterprise';
          const capabilities = config.enterpriseConfig?.voiceAgent?.capabilities || [];
          console.log('🔧 systemInstructions:', systemInstructions);
          // Enhanced system message with enterprise context
          const enhancedInstructions = `${systemInstructions}

Enterprise Context:
- Company: ${enterpriseName}
- Industry: ${config.enterpriseConfig?.enterprise?.industry || 'General'}
- Capabilities: ${capabilities.join(', ') || 'General assistance'}

Please provide helpful, professional assistance while maintaining the company's brand voice and expertise.`;
          
          const assistantConfig: CreateAssistantDTO = {
            name: config.enterpriseConfig?.voiceAgent?.name || 'Enterprise Assistant',
            model: {
              provider: 'openai',
              model: 'gpt-4o',
              messages: [
                {
                  role: 'system',
                  content: enhancedInstructions
                }
              ],
              temperature: 0.7,
              maxTokens: 1000
            },
            voice: {
              provider: '11labs',
              voiceId: '21m00Tcm4TlvDq8ikWAM'
            },
            firstMessage: `Hello! I'm your ${enterpriseName} assistant. How can I help you today?`,
            firstMessageMode: 'assistant-speaks-first',
            maxDurationSeconds: 600, // 10 minutes
            backgroundSound: 'off'
          };
          
          console.log('🔧 Enhanced assistant config:', {
            name: assistantConfig.name,
            instructionsLength: enhancedInstructions.length,
            enterprise: enterpriseName,
            capabilities: capabilities.length
          });
          
          startPromise = vapiInstance.start(assistantConfig);
          console.log('🔧 Using method 2: enhanced assistant object');
        } catch (startError2) {
          console.error('❌ Smart assistant creation failed:', startError2);
          throw startError2;
        }
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Call start timeout after 30 seconds')), 30000)
      );
      
      await Promise.race([startPromise, timeoutPromise]);
      console.log('✅ Vapi call started successfully');
    } catch (error: any) {
      console.error('❌ Vapi connection failed:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error keys:', Object.keys(error || {}));
      
      let errorMessage = 'Unknown error occurred';
      if (error?.type === 'start-method-error') {
        errorMessage = `Start method error: ${error?.stage || 'unknown stage'}`;
        if (error?.error?.status) {
          errorMessage += ` (HTTP ${error.error.status})`;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.toString) {
        errorMessage = error.toString();
      }
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isConnecting: false,
        status: 'Connection failed'
      }));
      throw new Error(errorMessage);
    }
  }, [vapiInstance, config?.assistantId, config?.publicKey, config?.baseUrl, config?.enterpriseConfig]);

  const disconnect = useCallback(() => {
    if (vapiInstance) {
      try {
        setState(prev => ({ ...prev, status: 'Disconnecting...' }));
        console.log('🔌 Disconnecting from Vapi Enterprise...');
        vapiInstance.stop();
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          status: 'Disconnected'
        }));
        console.log('✅ Disconnected from Vapi Enterprise');
      } catch (error) {
        console.error('❌ Error during disconnect:', error);
        setState(prev => ({ 
          ...prev, 
          isConnected: false, 
          status: 'Disconnected'
        }));
      }
    }
  }, [vapiInstance]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (vapiInstance) {
        console.log('🧹 Cleaning up Vapi Enterprise instance on unmount');
      }
    };
  }, [vapiInstance]);

  return {
    ...state,
    connect,
    disconnect,
  };
};