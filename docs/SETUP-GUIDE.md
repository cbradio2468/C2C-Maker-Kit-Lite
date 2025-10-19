# Complete Setup Guide: From Demo to Development

> **🚨 IMPORTANT:** This guide will help you transition from demo mode to a fully functional development environment.

## 🎯 Overview

The C2C Community Starter Kit runs in **demo mode** by default, using mock data and placeholder credentials. This guide will walk you through setting up real services so you can build your own applications.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 18+** installed ([Download here](https://nodejs.org/))
- ✅ **pnpm** package manager ([Install here](https://pnpm.io/installation))
- ✅ **Git** installed ([Download here](https://git-scm.com/))
- ✅ **A code editor** (VS Code recommended)

## 🚀 Step 1: Clone and Explore Demo Mode

First, let's get the demo running to see what we're building:

```bash
# Clone the repository
git clone https://github.com/catalysttocourage/c2c-community-starter.git
cd c2c-community-starter

# Install dependencies
pnpm install

# Start the demo
pnpm dev
```

**Open http://localhost:3000** to explore the demo application.

### What You'll See in Demo Mode

- **Landing Page** - Mission-driven content and philosophy
- **Resource Finder** - Complete example application
- **Mock Data** - Sample resources and categories
- **Placeholder Authentication** - Login/logout buttons (non-functional)

## 🔧 Step 2: Set Up Supabase (Database & Authentication)

### 2.1 Create a Supabase Account

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up** with GitHub, Google, or email
4. **Verify your email** if required

### 2.2 Create Your First Project

1. **Click "New Project"**
2. **Choose your organization** (or create one)
3. **Fill in project details:**
   - **Name:** `c2c-learning-project` (or your choice)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your users
4. **Click "Create new project"**
5. **Wait 2-3 minutes** for setup to complete

### 2.3 Get Your API Keys

1. **Go to your project dashboard**
2. **Click "Settings" → "API"** in the left sidebar
3. **Copy these values:**
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

## 🔑 Step 3: Understanding API Keys

### What Are API Keys?

API keys are **secret tokens** that authenticate your application with external services. Think of them as digital keys that unlock access to databases, payment processors, and other services.

### Types of Keys in Supabase

**Anon Key (Public):**
- **What it is:** A public key that allows read/write access to your database
- **Security:** Safe to expose in browser code (protected by Row Level Security)
- **Usage:** Used in client-side components and middleware
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Service Role Key (Secret):**
- **What it is:** A private key with full database access
- **Security:** NEVER expose this in client code - server-side only
- **Usage:** Used in server-side operations and admin functions
- **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different from anon key)

### Security Best Practices

#### ✅ DO:
- Store API keys in environment variables (`.env.local`)
- Use the anon key for client-side operations
- Implement Row Level Security (RLS) policies
- Rotate keys regularly (every 90 days)
- Use different keys for development/production
- Monitor usage for unusual activity

#### ❌ DON'T:
- Commit API keys to version control
- Hardcode keys in your source code
- Share keys in chat messages or emails
- Use production keys in development
- Trust client-side validation alone
- Ignore security warnings

## 🔧 Step 4: Configure Environment Variables

### 4.1 Copy the Example File

```bash
cp .env.example .env.local
```

### 4.2 Edit Your Environment File

Open `.env.local` in your code editor and replace the placeholder values:

```env
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations (server-side only)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4.3 Verify Your Setup

```bash
# Check that your .env.local file exists and has values
cat .env.local
```

## 🗄️ Step 5: Set Up Your Database

### 5.1 Run the Database Setup Script

```bash
node scripts/setup-database.js
```

This script will:
- Validate your Supabase credentials
- Create all necessary tables
- Set up Row Level Security policies
- Insert sample data
- Verify everything works

### 5.2 Manual Database Setup (Alternative)

If the script doesn't work, you can set up the database manually:

1. **Go to your Supabase dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Copy the contents** of `example-app/database/schema.sql`
4. **Paste into the SQL Editor**
5. **Click "Run"** to execute the script
6. **Copy the contents** of `example-app/database/seed.sql`
7. **Paste and run** to add sample data

## 🔐 Step 6: Enable Authentication

### 6.1 Re-enable Middleware

The demo mode disables authentication middleware. Re-enable it:

```bash
mv middleware.ts.disabled middleware.ts
```

### 6.2 Restart Your Development Server

```bash
pnpm dev
```

## ✅ Step 7: Verify Everything Works

### 7.1 Test the Application

1. **Open http://localhost:3000**
2. **Try to create an account** (click "Sign Up")
3. **Log in** with your new account
4. **Navigate to Resource Finder**
5. **Try adding a new resource**

### 7.2 Check Your Database

1. **Go to your Supabase dashboard**
2. **Click "Table Editor"**
3. **Verify you see these tables:**
   - `profiles`
   - `resource_categories`
   - `resources`
   - `resource_views`
   - `resource_feedback`
   - `saved_resources`

### 7.3 Test Authentication

1. **Sign up for a new account**
2. **Check the `profiles` table** - you should see your new user
3. **Sign out and sign back in**
4. **Verify you can only see your own data**

## 🚨 Troubleshooting

### Common Issues

**"Supabase credentials not found"**
- Check that `.env.local` exists and has the correct values
- Verify you copied the keys correctly from Supabase dashboard
- Make sure there are no extra spaces or quotes around the values

**"Database connection failed"**
- Verify your Supabase project is running (not paused)
- Check that your database password is correct
- Ensure your region selection is correct

**"Authentication not working"**
- Make sure you renamed `middleware.ts.disabled` to `middleware.ts`
- Check that Row Level Security policies are enabled
- Verify your anon key is correct

**"Cannot find module" errors**
- Run `pnpm install` to ensure all dependencies are installed
- Check that you're in the correct directory
- Try deleting `node_modules` and running `pnpm install` again

### Getting Help

If you're still having issues:

1. **Check the logs** in your terminal for specific error messages
2. **Read the documentation** in the `docs/` folder
3. **Join our Discord community** for real-time help
4. **Create an issue** on GitHub if you find a bug

## 🎉 Congratulations!

You've successfully set up your development environment! You now have:

- ✅ **Real Supabase database** with sample data
- ✅ **Working authentication** system
- ✅ **Secure API key management**
- ✅ **Complete example application** to learn from

## 🚀 Next Steps

Now that you have a working development environment:

1. **Read the documentation** in the `docs/` folder
2. **Explore the example code** to understand the patterns
3. **Try modifying the Resource Finder** to learn the concepts
4. **Build your own application** using the starter templates
5. **Apply to join the full C2C ecosystem** when you're ready

## 🔒 Security Reminders

Remember to:

- **Never commit** your `.env.local` file
- **Use different keys** for development and production
- **Rotate your keys** regularly
- **Monitor usage** for unusual activity
- **Keep your database password** secure

---

**Happy coding! Remember: Every line of code is an opportunity to serve others. Build with purpose.** 🚀
