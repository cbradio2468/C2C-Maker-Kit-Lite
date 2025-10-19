# Quick Reference: Demo Mode to Development

## 🚨 Demo Mode Notice

**This app runs with mock data and placeholder credentials.**

## 🔧 Quick Setup Checklist

### ✅ Prerequisites
- [ ] Node.js 18+ installed
- [ ] pnpm package manager installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

### ✅ Supabase Setup
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Copy Project URL and anon key from Settings → API
- [ ] Save database password securely

### ✅ Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add real Supabase URL and anon key
- [ ] Verify `.env.local` is in `.gitignore`

### ✅ Database Setup
- [ ] Run `node scripts/setup-database.js`
- [ ] Or manually run `example-app/database/schema.sql` in Supabase SQL Editor
- [ ] Run `example-app/database/seed.sql` for sample data

### ✅ Enable Authentication
- [ ] Rename `middleware.ts.disabled` to `middleware.ts`
- [ ] Restart development server with `pnpm dev`

## 🔑 API Key Quick Reference

### Supabase Anon Key (Public)
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- ✅ Safe for client-side code
- ✅ Protected by Row Level Security
- ✅ Used in browser components

### Supabase Service Role Key (Secret)
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- ❌ NEVER expose in client code
- ❌ Server-side only
- ❌ Has full database access

## 🚨 Security Reminders

### ✅ DO
- Store keys in `.env.local`
- Use different keys for dev/prod
- Rotate keys every 90 days
- Monitor usage for unusual activity

### ❌ DON'T
- Commit `.env.local` to git
- Hardcode keys in source code
- Share keys in chat messages
- Use production keys in development

## 🔗 Important Links

- **Supabase Dashboard:** [supabase.com/dashboard](https://supabase.com/dashboard)
- **Complete Setup Guide:** [docs/SETUP-GUIDE.md](docs/SETUP-GUIDE.md)
- **API Key Security:** [docs/API-KEY-SECURITY.md](docs/API-KEY-SECURITY.md)
- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)

## 🆘 Common Issues

**"Supabase credentials not found"**
- Check `.env.local` exists and has correct values
- Verify keys copied correctly from Supabase dashboard

**"Database connection failed"**
- Verify Supabase project is running (not paused)
- Check database password is correct

**"Authentication not working"**
- Make sure `middleware.ts.disabled` renamed to `middleware.ts`
- Check Row Level Security policies are enabled

**"Cannot find module" errors**
- Run `pnpm install` to install dependencies
- Check you're in the correct directory

## 🎯 Next Steps

1. **Explore the demo** - Understand what you're building
2. **Follow setup guide** - Get real services working
3. **Read documentation** - Learn the patterns
4. **Build your app** - Apply what you've learned
5. **Join C2C ecosystem** - Take it to the next level

---

**Remember: Every line of code is an opportunity to serve others. Build with purpose.** 🚀
