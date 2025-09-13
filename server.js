import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// SIP Webhook handler for incoming calls
app.post('/api/sip/webhook', async (req, res) => {
  try {
    console.log('📞 SIP Webhook received:', JSON.stringify(req.body, null, 2));
    
    const { type, data } = req.body;
    
    if (type === 'realtime.call.incoming') {
      const callId = data.call_id;
      
      // Extract project ID from SIP headers (for real calls) or from test data
      let projectId = null;
      
      // For test events, project ID might be in a different location
      if (data.project_id) {
        projectId = data.project_id;
      } else if (data.sip_headers) {
        const toHeader = data.sip_headers.find(header => header.name === 'To');
        if (toHeader && toHeader.value) {
          const sipUriMatch = toHeader.value.match(/sip:(proj_[^@]+)@sip\.api\.openai\.com/);
          if (sipUriMatch) {
            projectId = sipUriMatch[1];
          }
        }
      }
      
      console.log(`📞 Incoming call received - Call ID: ${callId}, Project ID: ${projectId}`);
      console.log('📞 Full data object:', JSON.stringify(data, null, 2));
      
      // Handle test calls or invalid call IDs
      if (!callId || callId === 'test' || callId === 'undefined') {
        console.log('🧪 Test call received - simulating successful call acceptance');
        return res.json({ 
          success: true, 
          message: 'Test call accepted successfully',
          callId: callId || data.id || 'test',
          projectId: projectId,
          status: 'accepted',
          simulated: true
        });
      }
      
      // Accept the call exactly like the Python example
      const callAccept = {
        type: "realtime",
        instructions: "You are a support agent.",
        model: "gpt-realtime"
      };
      
      console.log('📞 Attempting to accept call with OpenAI...');
      
      const acceptResponse = await fetch(`https://api.openai.com/v1/realtime/calls/${callId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callAccept)
      });
      
      if (!acceptResponse.ok) {
        const errorText = await acceptResponse.text();
        console.error('❌ Failed to accept call:', acceptResponse.status, errorText);
        console.error('❌ Response headers:', acceptResponse.headers);
        return res.status(500).json({ 
          success: false,
          error: 'Failed to accept call',
          status: acceptResponse.status,
          details: errorText
        });
      }
      
      console.log('✅ Call accepted successfully');
      
      // Start WebSocket connection exactly like Python example
      startCallMonitoring(callId);
      
      res.status(200).json({ 
        success: true, 
        message: 'Call accepted successfully',
        callId: callId
      });
    } else {
      console.log('ℹ️ Unknown webhook type:', type);
      res.json({ success: true, message: 'Webhook received' });
    }
    
  } catch (error) {
    console.error('❌ SIP Webhook error:', error);
    res.status(500).json({ 
      error: 'SIP webhook processing failed',
      details: error.message 
    });
  }
});

// Function to start monitoring a SIP call via WebSocket (exactly like Python example)
async function startCallMonitoring(callId) {
  try {
    console.log(`🔌 Attempting to connect WebSocket for call: ${callId}`);
    
    const ws = new WebSocket(`wss://api.openai.com/v1/realtime?call_id=${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    
    ws.on('open', () => {
      console.log(`🔌 WebSocket connected for call ${callId}`);
      
      // Send response exactly like Python example
      const responseCreate = {
        type: "response.create",
        response: {
          instructions: "Say to the user 'Thank you for calling, how can I help you'"
        }
      };
      
      ws.send(JSON.stringify(responseCreate));
      console.log(`📞 Sent initial response for call ${callId}`);
    });
    
    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log(`📞 Received from WebSocket: ${JSON.stringify(response)}`);
      } catch (error) {
        console.log(`📞 WebSocket raw message: ${data.toString()}`);
      }
    });
    
    ws.on('error', (error) => {
      console.error(`❌ WebSocket error: ${error.message}`);
    });
    
    ws.on('close', () => {
      console.log(`🔌 WebSocket closed for call ${callId}`);
    });
    
  } catch (error) {
    console.error(`❌ WebSocket error: ${error.message}`);
  }
}

// SIP Call management endpoints
app.post('/api/sip/calls/:callId/refer', async (req, res) => {
  try {
    const { callId } = req.params;
    const { target_uri } = req.body;
    
    console.log(`📞 Referring call ${callId} to ${target_uri}`);
    
    const referResponse = await fetch(`https://api.openai.com/v1/realtime/calls/${callId}/refer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_uri })
    });
    
    if (!referResponse.ok) {
      const errorText = await referResponse.text();
      console.error('❌ Failed to refer call:', referResponse.status, errorText);
      return res.status(500).json({ error: 'Failed to refer call' });
    }
    
    console.log('✅ Call referred successfully');
    res.json({ success: true, message: 'Call referred successfully' });
    
  } catch (error) {
    console.error('❌ Call refer error:', error);
    res.status(500).json({ 
      error: 'Call refer failed',
      details: error.message 
    });
  }
});

app.post('/api/sip/calls/:callId/reject', async (req, res) => {
  try {
    const { callId } = req.params;
    
    console.log(`📞 Rejecting call ${callId}`);
    
    const rejectResponse = await fetch(`https://api.openai.com/v1/realtime/calls/${callId}/reject`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!rejectResponse.ok) {
      const errorText = await rejectResponse.text();
      console.error('❌ Failed to reject call:', rejectResponse.status, errorText);
      return res.status(500).json({ error: 'Failed to reject call' });
    }
    
    console.log('✅ Call rejected successfully');
    res.json({ success: true, message: 'Call rejected successfully' });
    
  } catch (error) {
    console.error('❌ Call reject error:', error);
    res.status(500).json({ 
      error: 'Call reject failed',
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

// Test endpoint
app.post('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Voice Agent Backend Server running on port ${PORT}`);
  console.log(`📞 SIP webhook endpoint: http://localhost:${PORT}/api/sip/webhook`);
  console.log(`📞 SIP call management: http://localhost:${PORT}/api/sip/calls/:callId/refer`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
});

