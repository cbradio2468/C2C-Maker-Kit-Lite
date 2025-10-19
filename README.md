# Catalyst To Courage - Community Builder Starter Kit

> **"$100 and a Dream"** - Build applications that serve those who need them most

![C2C Banner](./public/images/banner.png)

## 🚨 IMPORTANT: Demo Mode Notice

**This application is currently running in DEMO MODE** with mock data and placeholder credentials. The app will work for exploration and learning, but you'll need to set up real services to build your own application.

## 🌟 What is This?

The C2C Community Builder Starter Kit is an educational resource that teaches you how to build **mission-driven applications** using modern web technologies.

This is NOT just another SaaS boilerplate. This is a **philosophy and methodology** for creating software that removes barriers and serves underserved communities.

## 🎯 Who This Is For

- 👨‍💻 **New developers** who want to build with purpose
- 🚀 **Social entrepreneurs** learning to code
- 🎓 **Students** creating their first impact project  
- 💡 **Anyone** with "$100 and a Dream"

## 🚀 Quick Start (Demo Mode)

```bash
# Clone the repository
git clone https://github.com/catalysttocourage/c2c-community-starter.git
cd c2c-community-starter

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

**Open http://localhost:3000** to see the demo application running with mock data.

## 🔧 Setting Up Real Development

### Step 1: Create a Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up for a free account
2. **Click "New Project"** and choose your organization
3. **Select a region** close to your users
4. **Set a database password** (save this securely!)
5. **Wait for setup** (usually 2-3 minutes)

### Step 2: Get Your API Keys

1. **Go to your project dashboard** at [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Click "Settings" → "API"** in the left sidebar
3. **Copy your Project URL** and **anon/public key**

### Step 3: Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your real credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Never commit `.env.local`** - it's already in `.gitignore`

### Step 4: Set Up Your Database

1. **Run the database setup script:**
   ```bash
   node scripts/setup-database.js
   ```

2. **Or manually run the SQL:**
   - Copy contents of `example-app/database/schema.sql`
   - Paste into Supabase SQL Editor
   - Run the script

### Step 5: Re-enable Authentication

1. **Rename the middleware file:**
   ```bash
   mv middleware.ts.disabled middleware.ts
   ```

2. **Restart your development server:**
   ```bash
   pnpm dev
   ```

## 🔑 Understanding API Keys

### What Are API Keys?

API keys are **secret tokens** that authenticate your application with external services. Think of them as digital keys that unlock access to databases, payment processors, and other services.

### Types of Keys in This Project

**Supabase Anon Key (Public):**
- **What it is:** A public key that allows read/write access to your database
- **Security:** Safe to expose in browser code (protected by Row Level Security)
- **Usage:** Used in client-side components and middleware

**Supabase Service Role Key (Secret):**
- **What it is:** A private key with full database access
- **Security:** NEVER expose this in client code - server-side only
- **Usage:** Used in server-side operations and admin functions

### Security Best Practices

#### ✅ DO:
- Store API keys in environment variables (`.env.local`)
- Use the anon key for client-side operations
- Implement Row Level Security (RLS) policies
- Rotate keys regularly
- Use different keys for development/production

#### ❌ DON'T:
- Commit API keys to version control
- Hardcode keys in your source code
- Share keys in chat messages or emails
- Use production keys in development
- Trust client-side validation alone

### How API Keys Work in This Application

```typescript
// Client-side (safe to expose)
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,     // Public URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Public anon key
)

// Server-side (more secure)
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,     // Public URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Public anon key
  // Service role key would go here for admin operations
)
```

**Why This Works:** Supabase uses Row Level Security (RLS) policies that run on the database server, ensuring users can only access data they're authorized to see, even with the public anon key.

## 🔒 API Key Security Guide

For comprehensive information about API key security, see our detailed guide:

**[🔑 API Key Security Guide →](docs/API-KEY-SECURITY.md)**

This guide covers:
- What API keys are and how they work
- Security best practices and common mistakes
- How to handle compromised keys
- Tools for key management and monitoring

## 📖 Complete Setup Guide

For detailed instructions on transitioning from demo mode to real development, see our comprehensive setup guide:

**[📋 Complete Setup Guide →](docs/SETUP-GUIDE.md)**

This guide covers:
- Setting up Supabase (database & authentication)
- Understanding API keys and security
- Configuring environment variables
- Database setup and verification
- Troubleshooting common issues

## 🧪 Verify Setup

Run the complete setup test to ensure everything is working:

```bash
node scripts/test-complete-setup.js
```

This will verify all components, documentation, and templates are properly configured.

## 📚 What You'll Learn

### 1. **Mission-Driven Development**
Learn to ask the right questions BEFORE writing code:
- Who am I serving?
- What barrier am I removing?
- How will I measure impact?
- Can they afford this?

### 2. **Database Design for Impact**
Structure data to serve users, not just store information:
- User-centric schemas
- Privacy-first design
- Accessibility considerations
- Row-level security

### 3. **Building Real Applications**
Follow our complete Resource Finder example:
- Next.js App Router patterns
- Supabase integration
- Authentication & authorization
- CRUD operations
- Search & filtering

### 4. **Security Best Practices**
Learn to build secure applications from day one:
- Row-Level Security (RLS)
- API key protection
- Server-side validation
- Rate limiting
- Data encryption

## 🎓 Learning Path

1. **Start Here**: Read [docs/00-WELCOME.md](./docs/00-WELCOME.md)
2. **Setup**: Follow [docs/01-GETTING-STARTED.md](./docs/01-GETTING-STARTED.md)
3. **Philosophy**: Study [docs/02-MISSION-ALIGNMENT.md](./docs/02-MISSION-ALIGNMENT.md)
4. **Build**: Complete [docs/04-BUILDING-YOUR-FIRST-APP.md](./docs/04-BUILDING-YOUR-FIRST-APP.md)
5. **Deploy**: Launch your first impact project!

## 🏗️ What's Included

### ✅ Working Example Application
**Resource Finder** - A complete application that helps people discover local resources:
- Full source code with extensive comments
- Database schema and migrations
- Authentication flow
- CRUD operations
- Search functionality
- Security implementations

### ✅ Starter Templates
- **Basic CRUD App** - Standard create/read/update/delete
- **Simple Dashboard** - Data visualization patterns
- **Plugin Starter** - Modular architecture basics

### ✅ CLI Wizard
```bash
npx create-c2c-app my-impact-project
```
Interactive tool that:
- Asks mission alignment questions
- Generates project structure
- Sets up database
- Creates initial code

### ✅ Educational Documentation
- Mission-driven methodology
- Database design patterns
- Security fundamentals
- Deployment guides
- Troubleshooting help

## 🚫 What's NOT Included

This is a **learning starter kit**, not the full C2C ecosystem:

- ❌ Full C2C Core OS
- ❌ Advanced AI agents
- ❌ Complete plugin registry
- ❌ Multi-tenant infrastructure
- ❌ Production deployment configs
- ❌ Advanced @kit/* packages

## 🌟 Ready for More?

After building with this starter kit, you can **apply to join the full C2C ecosystem**:

- 🔥 Access to complete C2C Core OS
- 🤖 AI-powered development agents
- 🏢 Multi-tenant architecture
- 🔌 Full plugin system
- 👥 Community support
- 🚀 Launch assistance

**[Apply Here →](https://catalysttocourage.com/apply)**

We review applications based on:
- Mission alignment with "$100 and a Dream"
- Projects built with this starter kit
- Commitment to serving underserved communities
- Technical capability demonstrated

## 💡 The C2C Philosophy

### "$100 and a Dream"

We believe the next generation of world-changing entrepreneurs don't have venture capital. They have:
- A problem they've personally experienced
- A community they want to serve
- $100 and determination

Our mission is to give them the tools to build solutions.

### Mission-First Development

Traditional software asks: "What features can we build?"

C2C asks:
1. **Who needs help?** (Identify the underserved)
2. **What's blocking them?** (Find the barrier)
3. **How do we remove it?** (Design the solution)
4. **Can they afford it?** (Ensure accessibility)
5. **How do we measure impact?** (Track real outcomes)

## 🤝 Contributing

We welcome contributions that align with our mission!

Please read:
- [CONTRIBUTING.md](./.github/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./.github/CODE_OF_CONDUCT.md)

## 🛡️ Intellectual Property & License Notice

© 2025 Catalyst To Courage (C2C). All rights reserved.
This repository and its contents — including but not limited to the C2C Project Brief Template, documentation, architecture frameworks, and educational materials — are protected under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0).

✅ You may read, learn from, and share this material with proper attribution.
❌ You may not use it for commercial purposes, modify it, or create derivative works.

For commercial licensing, collaboration, or educational use inquiries, please contact:
Chris Ballweg – Catalyst To Courage (C2C)
📧 [catalysttocourage@gmail.com]
🌐 https://catalysttocourage.com

## 🆘 Get Help

- 📖 [Documentation](./docs/)
- 💬 [GitHub Discussions](https://github.com/catalysttocourage/c2c-community-starter/discussions)
- 🐛 [Report Issues](https://github.com/catalysttocourage/c2c-community-starter/issues)
- 🌐 [C2C Website](https://catalysttocourage.com)

## 🙏 Acknowledgments

Built with love for the dreamers, the hustlers, and the change-makers.

Special thanks to everyone with "$100 and a Dream" who inspired this work.

---

**Start building with purpose today** 🚀
