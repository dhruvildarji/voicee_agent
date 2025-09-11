import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Generate ephemeral client token endpoint
app.post('/api/generate-ephemeral-token', async (req, res) => {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return res.status(500).json({ 
        error: 'OPENAI_API_KEY not found in environment variables' 
      });
    }

    console.log('🔑 Generating ephemeral token...');

    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-realtime'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `OpenAI API error: ${response.status} - ${errorText}` 
      });
    }

    const data = await response.json();
    console.log('✅ Ephemeral token generated successfully');

    res.json({
      success: true,
      ephemeralToken: data.value,
      expiresAt: data.expires_at
    });

  } catch (error) {
    console.error('❌ Error generating ephemeral token:', error);
    res.status(500).json({ 
      error: 'Failed to generate ephemeral token',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Voice Agent Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Voice Agent Backend Server running on port ${PORT}`);
  console.log(`📡 Ephemeral token endpoint: http://localhost:${PORT}/api/generate-ephemeral-token`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
