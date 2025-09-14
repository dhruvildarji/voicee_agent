# Vapi Integration Guide

This document explains how to use the newly added Vapi realtime API integration alongside the existing OpenAI realtime API.

## Overview

The voice agent now supports two voice providers:
- **OpenAI Realtime API** - High-quality voice conversations with GPT-4
- **Vapi Realtime API** - Fast and efficient voice conversations

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# OpenAI Configuration (existing)
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here

# Vapi Configuration (new)
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
VITE_VAPI_BASE_URL=https://api.vapi.ai  # Optional, defaults to https://api.vapi.ai
```

### 2. Get Vapi Credentials

1. Sign up at [Vapi Dashboard](https://dashboard.vapi.ai)
2. Create a new assistant
3. Get your public key and assistant ID from the dashboard
4. Add them to your environment variables

## Usage

### 1. Choose Voice Provider

In the main application, you'll see a "Choose Voice Provider" section where you can select between:
- **OpenAI Realtime API** - For high-quality, enterprise-grade voice conversations
- **Vapi Realtime API** - For fast, efficient voice conversations

### 2. Connect to Voice Assistant

1. Complete your enterprise configuration (if not already done)
2. Select your preferred voice provider
3. Click "Connect to Voice Assistant"
4. Allow microphone access when prompted
5. Start speaking naturally

### 3. Test Vapi Integration

A standalone Vapi test component is included for testing the integration independently of the main enterprise configuration.

## Features

### OpenAI Realtime API
- ✅ High-quality voice synthesis
- ✅ Advanced AI capabilities with GPT-4
- ✅ Enterprise-grade security
- ✅ SIP phone call integration
- ✅ Automatic ephemeral token generation

### Vapi Realtime API
- ✅ Fast response times
- ✅ Easy integration
- ✅ Real-time voice conversations
- ✅ Simple configuration
- ✅ Cost-effective

## Architecture

### New Components

1. **`useVoiceProvider` Hook** (`src/hooks/useVoiceProvider.tsx`)
   - Manages both OpenAI and Vapi connections
   - Provides unified interface for voice providers
   - Handles connection state and error management

2. **`VoiceProviderSelector` Component** (`src/components/VoiceProviderSelector.tsx`)
   - UI component for selecting voice provider
   - Shows features and capabilities of each provider
   - Disabled during active connections

3. **`VapiTestComponent` Component** (`src/components/VapiTestComponent.tsx`)
   - Standalone test component for Vapi integration
   - Independent of enterprise configuration
   - Shows configuration status and test button

### Updated Components

1. **`App.tsx`**
   - Integrated voice provider selection
   - Updated connection logic to support both providers
   - Added error handling for missing API keys
   - Updated UI to show provider-specific information

## Configuration

### Enterprise Configuration

The enterprise configuration system remains unchanged. Both voice providers will use the same enterprise data:
- Company information
- Industry templates
- Knowledge base
- API integrations
- SIP configuration (OpenAI only)

### Voice Provider Selection

Users can switch between providers at any time when not connected. The selection is stored in component state and persists during the session.

## Error Handling

The system provides clear error messages for:
- Missing API keys
- Connection failures
- Configuration issues
- Provider-specific errors

## Testing

### Test Vapi Integration

1. Set up your Vapi credentials in environment variables
2. Use the standalone Vapi test component
3. Click "Test Vapi Voice Assistant"
4. Verify voice conversation works

### Test OpenAI Integration

1. Set up your OpenAI API key
2. Select "OpenAI Realtime API" as provider
3. Click "Connect to Voice Assistant"
4. Verify voice conversation works

## Troubleshooting

### Common Issues

1. **"Vapi configuration is required"**
   - Ensure `VITE_VAPI_PUBLIC_KEY` and `VITE_VAPI_ASSISTANT_ID` are set
   - Check that the values are correct from your Vapi dashboard

2. **"OpenAI API key is required"**
   - Ensure `VITE_OPENAI_API_KEY` is set
   - Verify the key has Realtime API access

3. **Connection failures**
   - Check your internet connection
   - Verify API keys are valid
   - Check browser console for detailed error messages

### Debug Mode

Enable debug logging by checking the browser console. All connection attempts and errors are logged with detailed information.

## Migration

### From OpenAI-only to Dual Provider

No migration is required. The existing OpenAI functionality remains unchanged. Users can:
1. Continue using OpenAI as before
2. Optionally try Vapi for comparison
3. Switch between providers as needed

### Backward Compatibility

- All existing enterprise configurations work with both providers
- SIP integration remains OpenAI-only
- All existing features are preserved

## Future Enhancements

Potential future improvements:
- Provider-specific configuration options
- Voice quality comparison tools
- Cost analysis and usage tracking
- Advanced provider switching during conversations
- Provider-specific enterprise templates

## Support

For issues with:
- **OpenAI**: Check [OpenAI Realtime API documentation](https://platform.openai.com/docs/guides/realtime)
- **Vapi**: Check [Vapi documentation](https://docs.vapi.ai/)
- **Integration**: Check this repository's issues or create a new one
