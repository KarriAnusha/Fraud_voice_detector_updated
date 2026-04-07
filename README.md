[README.md](https://github.com/user-attachments/files/26527340/README.md)
# 🎙️ Fraud Voice Detector

A modern web application that detects fraudulent voice patterns using advanced AI/ML algorithms. Built with React, TypeScript, and Supabase for secure voice analysis and subscription management.

## ✨ Features

- **Voice Fraud Detection**: Advanced ML-based detection of fraudulent voice patterns
- **Real-time Waveform Visualization**: Visual feedback of audio processing
- **API Playground**: Interactive API testing interface
- **Subscription Management**: Freemium model with Stripe integration
- **Customer Portal**: User account and subscription management
- **Responsive Design**: Mobile-friendly interface with shadcn/ui components
- **API Documentation**: Comprehensive API reference and code examples
- **Authentication**: Secure user authentication via Supabase

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form state management

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, and serverless functions
- **Stripe** - Payment processing
- **Voice Detection API** - ML-powered voice fraud detection

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **PostCSS** - CSS transformations

## 📦 Prerequisites

- **Node.js** 16.x or higher
- **npm** or **bun** package manager
- **Git** for version control
- Supabase account for database and functions
- Stripe account for payment processing

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KarriAnusha/Fraud_voice_detector_updated.git
cd Fraud_voice_detector_updated/Fraud_voice_detector-main
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Run Development Server

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173`

## 📚 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build locally
npm run preview

# Run linter
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📂 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── ApiKeysDialog.tsx
│   ├── APIPlayground.tsx
│   ├── CodeBlock.tsx
│   ├── DocumentationSection.tsx
│   ├── FeaturesSection.tsx
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   └── WaveformVisualizer.tsx
├── contexts/           # React context providers
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations
│   └── supabase/
├── lib/               # Utilities and helpers
├── pages/             # Page components
│   ├── Index.tsx
│   ├── ApiReference.tsx
│   ├── Pricing.tsx
│   ├── PrivacyPolicy.tsx
│   └── TermsAndConditions.tsx
├── App.tsx            # Main app component
└── main.tsx           # Application entry point

supabase/
├── functions/         # Serverless functions
│   ├── detect-voice/       # Voice detection endpoint
│   ├── check-subscription/ # Subscription validation
│   ├── create-checkout/    # Stripe checkout creation
│   └── customer-portal/    # Account management
└── migrations/        # Database migrations
```

## 🔌 API Endpoints

### Voice Detection
- **POST** `/detect-voice` - Analyze audio for fraud patterns
  - Request: Audio file or audio stream
  - Response: Fraud detection results with confidence score

### Subscription Management
- **POST** `/check-subscription` - Verify user subscription status
- **POST** `/create-checkout` - Initialize Stripe payment session
- **GET** `/customer-portal` - Access customer account portal

## 🔐 Authentication

The application uses Supabase Authentication with:
- Email/password login
- Session management
- Protected routes
- User context via React Context API

## 💳 Payments

Stripe integration for:
- Subscription creation
- Payment processing
- Invoice management
- Billing portal

## 🧪 Testing

Run the test suite:

```bash
npm run test        # Single run
npm run test:watch  # Watch mode
```

Tests are located in `src/test/` directory.

## 📖 Documentation

### API Documentation
Visit the API Reference page in the application for:
- Detailed endpoint documentation
- Request/response examples
- Authentication requirements
- Rate limiting information

### Code Examples
The API Playground provides interactive examples for:
- Uploading audio files
- Making API calls
- Viewing real-time responses

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel (Recommended)

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy to Other Platforms

The project can be deployed to any platform that supports Node.js applications:
- Netlify
- Firebase Hosting
- AWS Amplify
- DigitalOcean
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Project Status

This project is currently in active development. Features and APIs may change.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Vite Documentation](https://vitejs.dev)

## ❓ FAQ

**Q: How accurate is the fraud detection?**
A: The detection algorithm uses state-of-the-art ML models with continuous improvement. Accuracy varies based on training data and audio quality.

**Q: Is my audio data stored?**
A: Audio files used for detection are processed and can be retained for model improvement (with user consent). Check our Privacy Policy for details.

**Q: What audio formats are supported?**
A: WAV, MP3, OGG, and other common audio formats are supported.

**Q: Can I use the API programmatically?**
A: Yes! Check the API Reference page for integration examples and authentication details.

## 📞 Support

For questions, issues, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact the development team via email

## 🙏 Acknowledgments

- shadcn/ui for beautiful React components
- Supabase for backend infrastructure
- Stripe for payment processing
- The open-source community

---

**Made with ❤️ by [Your Organization Name]**
