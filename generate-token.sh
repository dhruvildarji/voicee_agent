#!/bin/bash

# Script to generate OpenAI Realtime API client ephemeral token
# Usage: ./generate-token.sh YOUR_OPENAI_API_KEY

if [ -z "$1" ]; then
    echo "❌ Error: No API key provided"
    echo ""
    echo "Usage: ./generate-token.sh YOUR_OPENAI_API_KEY"
    echo "Example: ./generate-token.sh sk-proj-..."
    echo ""
    echo "Get your API key from: https://platform.openai.com/api-keys"
    exit 1
fi

API_KEY="$1"

# Validate API key format
if [[ ! "$API_KEY" =~ ^sk- ]]; then
    echo "❌ Error: Invalid API key format"
    echo "API keys should start with 'sk-'"
    echo "Get your API key from: https://platform.openai.com/api-keys"
    exit 1
fi

echo "🔑 Generating client ephemeral token..."
echo "API Key: ${API_KEY:0:10}..."

# Make the API call and capture the response
RESPONSE=$(curl -s -X POST https://api.openai.com/v1/realtime/client_secrets \
   -H "Authorization: Bearer $API_KEY" \
   -H "Content-Type: application/json" \
   -d '{
     "session": {
       "type": "realtime",
       "model": "gpt-realtime"
     }
   }')

# Check if jq is available
if command -v jq &> /dev/null; then
    TOKEN=$(echo "$RESPONSE" | jq -r '.value // empty')
    if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo "✅ Token generated successfully:"
        echo "$TOKEN"
    else
        echo "❌ Failed to extract token from response:"
        echo "$RESPONSE"
    fi
else
    echo "⚠️  jq not found, showing raw response:"
    echo "$RESPONSE"
    echo ""
    echo "Install jq for better output: brew install jq (macOS) or apt-get install jq (Ubuntu)"
fi

echo ""
echo "📋 Instructions:"
echo "1. Copy the token above"
echo "2. Open http://localhost:5173 in your browser"
echo "3. Paste the token into the API key field"
echo "4. Click 'Connect to Voice Agent'"
echo "5. Allow microphone access when prompted"
echo ""
echo "⏰ Note: This token expires quickly, so use it soon!"
