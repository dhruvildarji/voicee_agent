# SIP Phone Call Integration Setup Guide

This guide will help you set up SIP phone call integration for your enterprise voice assistant using OpenAI's Realtime API.

## Overview

With SIP integration, customers can call your configured phone number and speak directly with your AI voice assistant. The system automatically handles incoming calls, accepts them, and provides intelligent responses using your configured enterprise settings.

## Prerequisites

1. **OpenAI API Key** with Realtime API access
2. **OpenAI Project ID** (starts with `proj_`)
3. **SIP Trunking Provider** account (Twilio, Vonage, etc.)
4. **Public server** to host webhook endpoints
5. **Phone number** from your SIP provider

## Step 1: Configure Your Enterprise Settings

1. Open the Enterprise Setup Wizard
2. In Step 2 (Contact Information), enable SIP phone calls
3. Configure the following:
   - **SIP Phone Number**: Your purchased phone number (e.g., +1-800-123-4567)
   - **SIP Provider**: Choose your provider (Twilio, Vonage, Custom)
   - **Voice Assistant Instructions**: Customize how the assistant should behave on calls
   - **Voice**: Select the voice for phone calls (Alloy, Echo, Fable, Onyx, Nova, Shimmer)

## Step 2: Set Up OpenAI Webhook

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to your project settings
3. Set up a webhook with the following details:
   - **Webhook URL**: `https://your-domain.com/api/sip/webhook`
   - **Events**: Select `realtime.call.incoming`
   - **Secret**: Generate a webhook secret for security
signing secret - 
## Step 3: Configure SIP Provider

### For Twilio:
1. Log into your Twilio Console
2. Go to Phone Numbers → Manage → Active numbers
3. Click on your phone number
4. In the "Voice" section, set:
   - **Webhook URL**: `https://your-domain.com/api/sip/webhook`
   - **HTTP Method**: POST
5. Configure SIP trunking to point to: `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`

### For Vonage:
1. Log into your Vonage API Dashboard
2. Go to Numbers → Your Numbers
3. Configure the webhook URL for incoming calls
4. Set up SIP trunking with the OpenAI endpoint

### For Custom SIP Provider:
1. Configure your SIP trunk to route calls to: `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`
2. Ensure TLS transport is enabled
3. Set up proper authentication if required

## Step 4: Environment Variables

Create a `.env` file in your project root with:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_PROJECT_ID=proj_your_project_id_here
OPENAI_WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3001
NODE_ENV=production

# SIP Configuration (Optional)
SIP_PROVIDER=twilio
SIP_PHONE_NUMBER=+18001234567
```

## Step 5: Deploy Your Server

1. Deploy your server to a public domain (Heroku, AWS, DigitalOcean, etc.)
2. Ensure the following endpoints are accessible:
   - `POST /api/sip/webhook` - Handles incoming call webhooks
   - `POST /api/sip/calls/:callId/accept` - Accepts incoming calls
   - `POST /api/sip/calls/:callId/reject` - Rejects incoming calls
   - `POST /api/sip/calls/:callId/refer` - Transfers calls

## Step 6: Test the Integration

1. **Test Webhook**: Use a tool like ngrok to expose your local server and test webhook delivery
2. **Test Phone Call**: Call your configured phone number
3. **Monitor Logs**: Check server logs for webhook events and call handling

## API Endpoints

### Webhook Endpoint
```
POST /api/sip/webhook
Content-Type: application/json

{
  "type": "realtime.call.incoming",
  "data": {
    "call_id": "call_123",
    "project_id": "proj_456"
  }
}
```

### Call Management Endpoints
```
POST /api/sip/calls/:callId/accept
POST /api/sip/calls/:callId/reject
POST /api/sip/calls/:callId/refer
```

## Troubleshooting

### Common Issues:

1. **Webhook not receiving calls**
   - Check webhook URL is publicly accessible
   - Verify webhook secret configuration
   - Check server logs for errors

2. **Calls not being accepted**
   - Verify OpenAI API key has Realtime API access
   - Check project ID is correct
   - Ensure webhook is properly configured

3. **SIP trunking issues**
   - Verify SIP URI format: `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`
   - Check TLS transport is enabled
   - Verify authentication credentials

### Debug Steps:

1. Check server logs for webhook events
2. Test webhook endpoint with curl:
   ```bash
   curl -X POST  https://f5a4fb3ae098.ngrok-free.app/api/sip/webhook \
     -H "Content-Type: application/json" \
     -d '{"type": "realtime.call.incoming", "data": {"call_id": "test", "project_id": "proj_5n75yaXMrNWkTQUCR660jbl6"}}'
   ```
3. Monitor OpenAI platform logs for SIP events
4. Check SIP provider logs for call routing

## Security Considerations

1. **Webhook Security**: Use HTTPS and webhook secrets
2. **API Key Protection**: Never expose API keys in client-side code
3. **Rate Limiting**: Implement rate limiting for webhook endpoints
4. **Input Validation**: Validate all incoming webhook data

## Cost Considerations

- **OpenAI Realtime API**: Charged per minute of conversation
- **SIP Provider**: Monthly phone number costs + per-minute charges
- **Server Hosting**: Costs for hosting webhook endpoints

## Support

For additional help:
- [OpenAI Realtime API Documentation](https://platform.openai.com/docs/guides/realtime)
- [OpenAI SIP Integration Guide](https://platform.openai.com/docs/guides/realtime/sip)
- [Twilio SIP Documentation](https://www.twilio.com/docs/sip-trunking)
- [Vonage SIP Documentation](https://developer.vonage.com/sip-trunking)

## Example Configuration

Here's a complete example configuration for a hotel:

```json
{
  "enterprise": {
    "name": "Grand Hotel",
    "industry": "hotel",
    "sipConfig": {
      "enabled": true,
      "phoneNumber": "+1-800-HOTEL-01",
      "sipProvider": "twilio",
      "instructions": "You are the concierge for Grand Hotel. Help guests with reservations, room service, local recommendations, and hotel amenities.",
      "voice": "alloy"
    }
  }
}
```

This configuration will allow guests to call +1-800-HOTEL-01 and speak with an AI concierge that can help with hotel-related inquiries.
