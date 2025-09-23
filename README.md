# Enterprise Voice Assistant Framework

A customizable voice-powered AI assistant framework that can be configured for any enterprise. Built with OpenAI's Realtime API and React, this framework allows companies to create their own voice assistants with custom knowledge bases, APIs, and branding.

## Features

- **🏢 Enterprise Agnostic**: Configure for any company or industry
- **🎤 Real-time Voice Interaction**: Uses OpenAI's Realtime API for natural conversations
- **📞 SIP Phone Integration**: Customers can call your voice assistant directly via phone
- **📚 Custom Knowledge Base**: Upload company-specific documents and policies
- **🔧 API Integration**: Connect your existing APIs and services
- **🎨 Customizable Branding**: Company-specific instructions and personality
- **⚡ Easy Setup**: 4-step wizard to configure your voice assistant
- **🔍 Industry Templates**: Pre-configured templates for airlines, hotels, banks, retail, etc.
- **🌐 Webhook Support**: Automatic call handling and management

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd voice_agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Production Build & Start**
   ```bash
   npm run build
   npm start
   ```
   The server will serve the built frontend and expose API endpoints at `/api/*`.

5. **Configure Your Enterprise**
   - Open your browser to `http://localhost:5173`
   - Follow the 4-step setup wizard
   - Enter your company information, APIs, and knowledge base
   - Connect and start using your custom voice assistant!

## SIP Phone Integration

This framework supports SIP phone integration, allowing customers to call your voice assistant directly via phone. The system automatically handles incoming calls and provides intelligent responses using your configured enterprise settings.

### SIP Setup Process

1. **Configure SIP in Setup Wizard**: Enable SIP phone calls in Step 2 of the setup wizard
2. **Purchase Phone Number**: Get a phone number from a SIP provider (Twilio, Vonage, etc.)
3. **Configure SIP Trunk**: Point your SIP trunk to `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`
4. **Set Up Webhook**: Configure webhook at platform.openai.com pointing to your server
5. **Deploy Server**: Deploy your server to handle incoming call webhooks

### SIP Features

- **Automatic Call Handling**: Incoming calls are automatically accepted and routed to your voice assistant
- **Custom Instructions**: Configure how the assistant should behave during phone calls
- **Voice Selection**: Choose from multiple voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
- **Call Management**: Accept, reject, or transfer calls programmatically
- **Real-time Monitoring**: WebSocket connection for live call monitoring

For detailed setup instructions, see [SIP_SETUP_GUIDE.md](./SIP_SETUP_GUIDE.md).

## Environment Setup

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
OPENAI_PROJECT_ID=proj_your_project_id_here
OPENAI_WEBHOOK_SECRET=your_webhook_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development

# SIP Configuration (Optional)
SIP_PROVIDER=twilio
SIP_PHONE_NUMBER=+18001234567
```

## 🔑 Automatic Ephemeral Token Generation

The voice assistant now automatically generates ephemeral client tokens using your OpenAI API key from the backend server. No manual token generation required!

### Backend Server Setup

1. **Create a `.env` file** in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   ```

2. **Start the backend server** (in a separate terminal):
   ```bash
   npm run server
   ```

3. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```

4. **Or run both together**:
   ```bash
   npm run dev:full
   ```

The backend server automatically generates ephemeral tokens at `POST /api/token` and the frontend calls this endpoint. Never expose your API key in the browser.

## PWA install on your phone

- Open the deployed URL in Chrome (Android) or Safari (iOS).
- Use "Add to Home Screen". The app will install and run standalone.
- Requirements: site must be served over HTTPS and be publicly reachable.

**Important**: Your OpenAI API key must have access to the Realtime API. Make sure your account has the necessary permissions.

## Enterprise Configuration

The framework offers two ways to configure your voice assistant:

### 📁 File-Based Configuration (Recommended)
- Load pre-configured enterprise settings from JSON files
- Perfect for loading existing enterprise configurations
- Download template and customize for your company
- Quick setup for established enterprises

### 🔧 Setup Wizard
- Interactive 4-step configuration process
- Perfect for creating new enterprise configurations
- Step-by-step guidance through all settings
- Real-time validation and preview

### Configuration Options

**Enterprise Information:**
- Company name and industry
- Description and headquarters
- Website and basic information

**Contact Information:**
- Support hours and phone number
- Email and WhatsApp support
- Languages supported

**API Configuration:**
- Add your existing APIs
- Configure endpoints and parameters
- Set up authentication methods

**Knowledge Base:**
- Upload company documents
- Add policies and procedures
- Organize by categories

## Project Structure

```
src/
├── framework/                    # Enterprise framework core
│   ├── types/
│   │   └── EnterpriseConfig.ts  # Configuration type definitions
│   ├── EnterpriseConfigManager.ts # Configuration management
│   └── EnterpriseSetupWizard.tsx # Setup wizard component
├── examples/                     # Example implementations
│   ├── da-airlines/             # DA Airlines example
│   └── other-industries/        # Other industry examples
├── App.tsx                      # Main application component
├── App.css                      # Styling
└── main.tsx                     # Application entry point
```

## Industry Templates

The framework includes pre-configured templates for common industries:

### 🛫 Airlines
- Flight booking and reservations
- Baggage policies and check-in
- Flight status and delays
- Loyalty programs and special assistance

### 🏨 Hotels
- Room booking and availability
- Check-in/check-out procedures
- Amenities and services
- Loyalty programs

### 🏦 Banking
- Account inquiries and transactions
- Transfer and payment services
- Loan and credit information
- Fraud protection

### 🛍️ Retail
- Product information and availability
- Order status and tracking
- Returns and exchanges
- Store locations

## Customization

### Adding New Industry Templates
1. Add your industry template to `INDUSTRY_TEMPLATES` in `EnterpriseConfig.ts`
2. Define industry-specific capabilities and default APIs
3. Create example configurations

### Extending API Integration
1. Implement your API logic in the framework
2. Add authentication methods
3. Configure response formatting for voice

### Knowledge Base Management
1. Upload documents through the setup wizard
2. Organize by categories and tags
3. Use semantic search for better retrieval

## Example: DA Airlines Implementation

See the `da-airlines-voice-agent` repository for a complete example implementation with:
- Flight status API with multiple endpoints
- Refund management system
- Comprehensive knowledge base
- Customer support tools

**Quick Start with DA Airlines:**
1. Download the `da-airlines-config.json` file from the DA Airlines repository
2. Use the "Load from File" option in the framework
3. Select the DA Airlines configuration file
4. Your DA Airlines voice assistant will be ready to use!

The configuration file includes all DA Airlines specific settings, APIs, and knowledge base content.

## API Integration

The framework supports various API integration patterns:

### REST APIs
- GET, POST, PUT, DELETE methods
- Custom headers and authentication
- Response formatting for voice

### Real-time Data
- Flight status updates
- Inventory management
- Customer account information

### Third-party Services
- Payment processing
- Shipping and logistics
- Communication platforms

## Troubleshooting

### Common Issues

1. **Setup Wizard Issues**
   - Ensure all required fields are filled
   - Check that API URLs are valid
   - Verify document formats

2. **API Integration Problems**
   - Test API endpoints independently
   - Check authentication credentials
   - Verify response formats

3. **Knowledge Base Issues**
   - Ensure documents are properly formatted
   - Check category assignments
   - Test search functionality

### Debug Mode
Enable debug logging by opening browser developer tools and checking the console for detailed information about:
- Configuration validation
- API calls and responses
- Knowledge base searches
- Voice connection status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your industry template or feature
4. Test thoroughly with different configurations
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the Realtime API and agents SDK
- React and TypeScript communities
- Enterprise customers and contributors