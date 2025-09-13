import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              🎤 Enterprise Voice Assistant Framework
            </h1>
            <p className="hero-subtitle">
              Transform your customer service with AI-powered voice assistants tailored to your business
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Quick Setup</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <span>Customizable</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌐</span>
                <span>Multi-language</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔌</span>
                <span>API Integration</span>
              </div>
            </div>
            <button className="cta-button" onClick={onGetStarted}>
              Get Started Now
            </button>
          </div>
          <div className="hero-visual">
            <div className="voice-wave">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Our Voice Assistant?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🏢</div>
              <h3>Enterprise Ready</h3>
              <p>Built for businesses of all sizes with enterprise-grade security and scalability</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🎯</div>
              <h3>Industry Specific</h3>
              <p>Pre-configured templates for airlines, hotels, banking, retail, and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🔗</div>
              <h3>API Integration</h3>
              <p>Connect with your existing systems and databases for real-time information</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📚</div>
              <h3>Knowledge Base</h3>
              <p>Upload your policies, FAQs, and documentation for intelligent responses</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🌍</div>
              <h3>Multi-language Support</h3>
              <p>Serve customers in their preferred language with automatic translation</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">⚙️</div>
              <h3>Easy Configuration</h3>
              <p>Set up your voice assistant in minutes with our intuitive wizard</p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Configure Your Business</h3>
                <p>Enter your company details, industry, and contact information</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Connect Your APIs</h3>
                <p>Integrate your existing systems for real-time data access</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Upload Knowledge Base</h3>
                <p>Add your policies, FAQs, and documentation</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Deploy & Test</h3>
                <p>Launch your voice assistant and start serving customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Industries Section */}
        <div className="industries-section">
          <h2 className="section-title">Perfect for Every Industry</h2>
          <div className="industries-grid">
            <div className="industry-item">
              <div className="industry-icon">✈️</div>
              <h3>Airlines</h3>
              <p>Flight bookings, status updates, baggage policies</p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🏨</div>
              <h3>Hotels</h3>
              <p>Reservations, amenities, check-in/out procedures</p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🏦</div>
              <h3>Banking</h3>
              <p>Account inquiries, transfers, loan information</p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🛍️</div>
              <h3>Retail</h3>
              <p>Product info, orders, returns, loyalty programs</p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">🏥</div>
              <h3>Healthcare</h3>
              <p>Appointments, insurance, medical information</p>
            </div>
            <div className="industry-item">
              <div className="industry-icon">📱</div>
              <h3>Telecom</h3>
              <p>Plan details, billing, technical support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Customer Service?</h2>
            <p>Join thousands of businesses already using our voice assistant platform</p>
            <button className="cta-button large" onClick={onGetStarted}>
              Start Your Free Trial
            </button>
            <div className="cta-features">
              <span>✓ No credit card required</span>
              <span>✓ Setup in minutes</span>
              <span>✓ 24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
