#!/bin/bash

# Generate OpenAI Ephemeral Client Token for Realtime API
# Usage: ./generate-ephemeral-token.sh

echo "🔑 Generating OpenAI Ephemeral Client Token..."
echo ""

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    echo ""
    echo "Please set your OpenAI API key:"
    echo "export OPENAI_API_KEY='your-api-key-here'"
    echo ""
    echo "Or run this script with:"
    echo "OPENAI_API_KEY='your-api-key-here' ./generate-ephemeral-token.sh"
    exit 1
fi

echo "📡 Making request to OpenAI API..."

# Make the API request
response=$(curl -s -X POST https://api.openai.com/v1/realtime/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "session": {
      "type": "realtime",
      "model": "gpt-realtime"
    }
  }')

# Check if the request was successful
if [ $? -eq 0 ]; then
    echo "✅ Success! Here's your ephemeral client token:"
    echo ""
    echo "$response" | jq -r '.client_secret.value' 2>/dev/null || echo "$response"
    echo ""
    echo "⚠️  Note: This token expires quickly and needs to be regenerated for each session."
    echo "💡 Copy this token and paste it into the voice assistant interface."
else
    echo "❌ Error: Failed to generate token"
    echo "Response: $response"
fi

