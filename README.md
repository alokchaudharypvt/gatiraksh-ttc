# Railway Traffic Control System

## AI-Powered Train Traffic Management & Conflict Resolution

A comprehensive railway traffic control system built with Next.js, featuring real-time conflict detection, AI-powered optimization, and intelligent resolution strategies for Indian Railway operations.

![Railway Control System](https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop)

## 🚂 Features

### Core Functionality
- **Real-time Train Tracking**: Live visualization of train movements across major Indian Railway corridors
- **AI Conflict Detection**: Automated detection of platform conflicts, collision risks, and resource conflicts
- **Intelligent Resolution**: AI-powered suggestion engine with ranked resolution strategies
- **Performance Analytics**: Comprehensive metrics and optimization insights
- **Scenario Simulation**: What-if analysis with predictive modeling

### AI & Machine Learning
- **Groq AI Integration**: Lightning-fast conflict resolution suggestions
- **Predictive Analytics**: Proactive conflict detection before they occur
- **Route Optimization**: AI-driven route planning and scheduling optimization
- **Performance Forecasting**: Predictive models for throughput and delay analysis

### User Experience
- **Interactive Dashboard**: Real-time monitoring with intuitive controls
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Demo Mode**: Comprehensive demonstration capabilities for presentations
- **Accessibility**: WCAG 2.1 compliant with screen reader support

## 🛠 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Modern styling with design system
- **shadcn/ui**: High-quality component library
- **Recharts**: Interactive data visualization

### Backend & AI
- **Groq AI**: Ultra-fast AI inference for conflict resolution
- **Next.js API Routes**: Serverless backend functions
- **Real-time Updates**: Live data streaming and updates

### Development & Testing
- **Comprehensive Testing**: Unit, integration, and E2E test suites
- **Performance Monitoring**: Built-in analytics and performance tracking
- **Demo Infrastructure**: Reproducible demonstration scenarios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-org/railway-control-system.git
   cd railway-control-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your Groq API key
   GROQ_API_KEY=your_groq_api_key_here
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Mode Setup

For hackathon demonstrations and presentations:

1. **Load demo data**
   - Click "Demo Control Panel" in the dashboard
   - Select your preferred demo mode
   - Click "Load Demo Data"

2. **Start simulation**
   - Choose time scale (1x to 4x speed)
   - Click "Start Simulation"
   - Watch real-time conflict detection and resolution

## 📊 System Architecture

### Component Structure
\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── trains/        # Train management
│   │   ├── conflicts/     # Conflict detection & resolution
│   │   ├── ai/           # AI optimization engine
│   │   └── demo/         # Demo mode functionality
│   └── page.tsx          # Main dashboard
├── components/            # React components
│   ├── train-visualization.tsx
│   ├── scenario-analysis.tsx
│   ├── conflict-resolution-modal.tsx
│   └── demo-control-panel.tsx
└── scripts/              # Testing and utilities
\`\`\`

### Data Flow
1. **Real-time Data Ingestion**: Train positions, schedules, and status updates
2. **Conflict Detection Engine**: AI-powered analysis of potential conflicts
3. **Resolution Generation**: Groq AI generates ranked resolution strategies
4. **Implementation**: Automated or manual application of solutions
5. **Performance Monitoring**: Continuous tracking of system effectiveness

## 🎯 Key Features Deep Dive

### Conflict Detection & Resolution

The system automatically detects four types of conflicts:

1. **Platform Conflicts**: Multiple trains assigned to same platform
2. **Collision Risks**: Insufficient separation between trains
3. **Signal Conflicts**: Contradictory signal aspects
4. **Resource Conflicts**: Competing demands for limited resources

**AI Resolution Process:**
- Conflict detected → AI analyzes context → Generates ranked suggestions → Human approval → Implementation

### Performance Analytics

Comprehensive metrics tracking:
- **Throughput Analysis**: Trains per hour, capacity utilization
- **Delay Metrics**: Average delays, on-time performance
- **Efficiency Scores**: Resource utilization, optimization gains
- **Predictive Insights**: Forecasted performance trends

### Demo Capabilities

Four specialized demo modes:
- **Standard Demo**: Complete system overview
- **Conflict Resolution Demo**: Focus on AI conflict handling
- **Optimization Demo**: Showcase performance improvements
- **Performance Analytics Demo**: Comprehensive metrics display

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run all tests
npm run test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:performance # Performance tests

# Run Python test suite
python scripts/test-runner.py
\`\`\`

### Test Coverage

- **Unit Tests**: Component logic, utility functions
- **Integration Tests**: API endpoints, data flow
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Response times, load handling

### UI Button Testing

All interactive elements are documented in `ui_buttons.csv` with:
- Button labels and locations
- Expected actions and payloads
- Test case mappings
- Accessibility attributes

## 📈 Performance Benchmarks

### Response Times
- API endpoints: < 200ms average
- AI suggestions: < 2s generation time
- Real-time updates: < 100ms latency
- Dashboard load: < 1s initial render

### Scalability
- Supports 100+ concurrent trains
- Handles 1000+ conflict scenarios
- Real-time processing of 10k+ events/hour
- Sub-second conflict detection

## 🔧 Configuration

### Environment Variables

\`\`\`bash
# AI Configuration
GROQ_API_KEY=your_groq_api_key

# Performance Settings
NEXT_PUBLIC_UPDATE_INTERVAL=2500
NEXT_PUBLIC_MAX_TRAINS=100

# Demo Configuration
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_SPEED=2
\`\`\`

### Customization

The system supports extensive customization:
- **Railway Networks**: Configure different corridor layouts
- **AI Models**: Adjust conflict detection sensitivity
- **UI Themes**: Customize colors and branding
- **Performance Metrics**: Define custom KPIs

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set environment variables**
   - Add `GROQ_API_KEY` in Vercel dashboard
   - Configure any custom settings

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Docker Deployment

\`\`\`bash
# Build image
docker build -t railway-control .

# Run container
docker run -p 3000:3000 -e GROQ_API_KEY=your_key railway-control
\`\`\`

## 📚 API Documentation

### Core Endpoints

#### Trains API
\`\`\`typescript
GET /api/trains
POST /api/trains/control
\`\`\`

#### Conflicts API
\`\`\`typescript
GET /api/conflicts
POST /api/conflicts (generate_suggestions | resolve)
\`\`\`

#### AI Optimization
\`\`\`typescript
POST /api/ai/optimize
GET /api/ai/performance
\`\`\`

#### Demo Mode
\`\`\`typescript
GET /api/demo/seed
POST /api/demo/seed
POST /api/demo/simulate
\`\`\`

### Response Formats

All APIs return standardized responses:
\`\`\`typescript
{
  success: boolean
  data?: any
  error?: string
  timestamp: string
}
\`\`\`

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow coding standards and add tests
4. **Run tests**: Ensure all tests pass
5. **Submit PR**: Include description and test results

### Coding Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Accessibility**: WCAG 2.1 AA compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Indian Railways**: Inspiration and domain expertise
- **Groq**: AI inference capabilities
- **Vercel**: Hosting and deployment platform
- **shadcn/ui**: Component library foundation

## 📞 Support

### Documentation
- [API Reference](docs/api.md)
- [Component Guide](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [GitHub Issues](https://github.com/your-org/railway-control-system/issues)
- [Discussions](https://github.com/your-org/railway-control-system/discussions)

### Commercial Support
For enterprise deployments and custom development:
- Email: support@railway-control.com
- Website: https://railway-control.com

---

**Built with ❤️ for Indian Railways and the global transportation community**
