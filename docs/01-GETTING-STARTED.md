# Getting Started

## 🚀 Let's Build Your First Mission-Driven App

This guide will get you from zero to a working application in about 30 minutes. We'll build a **Resource Finder** - an app that helps people discover local resources like food banks, shelters, and community services.

### What You'll Build

By the end of this tutorial, you'll have:
- ✅ A working Next.js application
- ✅ A Supabase database with proper security
- ✅ User authentication
- ✅ A resource listing page
- ✅ A resource detail page
- ✅ A form to add new resources
- ✅ Search functionality

### Prerequisites

You need:
- A computer (Windows, Mac, or Linux)
- An internet connection
- About 30 minutes
- No coding experience required!

## Step 1: Set Up Your Development Environment

### Install Node.js

1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS version (Long Term Support)
3. Run the installer
4. Restart your terminal/command prompt

**Verify installation:**
```bash
node --version
npm --version
```

You should see version numbers. If you get errors, restart your computer and try again.

### Install pnpm (Package Manager)

We use pnpm because it's faster and more efficient than npm:

```bash
npm install -g pnpm
```

**Verify installation:**
```bash
pnpm --version
```

## Step 2: Create Your Supabase Project

Supabase is our database and authentication provider. It's free for small projects!

### Create Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

### Create New Project

1. Click "New Project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `my-resource-finder` (or whatever you want)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"

**Wait 2-3 minutes** for the project to set up.

### Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values (you'll need them soon):
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

⚠️ **Important**: Never share your service role key! Only use the anon key.

## Step 3: Set Up the Code

### Clone the Starter Kit

```bash
# Clone the repository
git clone https://github.com/catalysttocourage/c2c-community-starter.git
cd c2c-community-starter

# Install dependencies
pnpm install
```

### Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Open `.env.local` in your text editor
3. Replace the placeholder values with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save the file.**

## Step 4: Set Up the Database

### Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `example-app/database/schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl+Enter)

You should see "Success. No rows returned" - this means the tables were created successfully!

### Verify Tables Were Created

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `resource_categories`
   - `resources`
   - `resource_views`
   - `resource_feedback`
   - `saved_resources`

If you see all these tables, you're ready to go!

## Step 5: Run the Application

### Start the Development Server

```bash
cd example-app
pnpm dev
```

You should see:
```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- ready in 2.3s
```

### Open Your App

1. Open your browser
2. Go to `http://localhost:3000`
3. You should see the Resource Finder landing page!

🎉 **Congratulations!** You now have a working application.

## Step 6: Test the Features

### Test Authentication

1. Click "Sign Up" or "Sign In"
2. Create an account with your email
3. Check your email for the verification link
4. Click the link to verify your account
5. You should be logged in!

### Test Adding Resources

1. Click "Add Resource" (you need to be logged in)
2. Fill out the form with sample data:
   - **Name**: "Local Food Bank"
   - **Description**: "Free groceries for families in need"
   - **Category**: Select "Food Assistance"
   - **Phone**: "555-123-4567"
   - **Address**: "123 Main St, Your City, ST 12345"
3. Click "Save Resource"
4. You should see your resource in the list!

### Test Search

1. Go back to the main page
2. Try searching for "food" or "bank"
3. Your resource should appear in the results!

## 🎯 What Just Happened?

You just built a complete web application! Here's what we accomplished:

### ✅ Database Setup
- Created secure tables with Row-Level Security (RLS)
- Set up user authentication
- Added proper relationships between data

### ✅ Frontend Application
- Built with Next.js 14 (latest version)
- Responsive design that works on phones
- Accessible to screen readers
- Fast loading with Server Components

### ✅ Security Features
- Users can only see/edit their own data
- Public resources are visible to everyone
- Input validation prevents bad data
- Authentication required for sensitive operations

### ✅ Real-World Features
- User registration and login
- Create, read, update, delete resources
- Search and filtering
- Mobile-friendly interface

## 🚨 Troubleshooting

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

### "Database connection failed"
- Check your `.env.local` file has the correct Supabase URL and key
- Make sure your Supabase project is running (not paused)
- Verify you copied the keys correctly (no extra spaces)

### "Authentication not working"
- Check your email for the verification link
- Make sure you're using the correct email address
- Try logging out and back in

### "Can't see my resources"
- Make sure you're logged in
- Check that the resource was saved successfully
- Try refreshing the page

## 🎉 Next Steps

You now have a working application! Here's what to do next:

1. **Customize It**: Change the colors, add your logo, modify the text
2. **Add More Features**: Categories, user profiles, resource reviews
3. **Deploy It**: Put it online so others can use it
4. **Build Your Own**: Use this as a template for your own idea

### Ready for More?

- **Learn the Philosophy**: Read [Mission Alignment →](./02-MISSION-ALIGNMENT.md)
- **Understand the Database**: Study [Database Design →](./03-DATABASE-DESIGN.md)
- **Build Your Own App**: Follow [Building Your First App →](./04-BUILDING-YOUR-FIRST-APP.md)

## 💡 Pro Tips

### For Beginners
- Don't worry about understanding every line of code yet
- Focus on getting it working first
- Experiment with changing text and colors
- Ask questions in GitHub Discussions

### For Experienced Developers
- Check out the RLS policies in the database schema
- Look at how we handle authentication in the Supabase clients
- Notice the Server Component patterns for better performance
- Study the accessibility attributes in the components

---

**You did it!** 🎉 You've built your first mission-driven application. 

Now let's learn how to think about building software that actually helps people.

Next: [Mission Alignment →](./02-MISSION-ALIGNMENT.md)
