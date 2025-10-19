# API Key Security Guide

> **🔒 CRITICAL:** Understanding API key security is essential for building safe applications.

## 🎯 What Are API Keys?

API keys are **secret tokens** that authenticate your application with external services. Think of them as digital keys that unlock access to databases, payment processors, email services, and other APIs.

### Real-World Analogy

Imagine API keys like keys to different rooms in a building:
- **Public keys** (like Supabase anon keys) are like keys to public areas - safe to carry around
- **Private keys** (like service role keys) are like master keys - must be kept secure and never shared

## 🔑 Types of API Keys in This Project

### Supabase Anon Key (Public)
```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it is:**
- A public key that allows read/write access to your database
- Safe to expose in browser code
- Protected by Row Level Security (RLS) policies

**Security level:** 🟡 **Moderate** - Safe for client-side use

**Why it's safe:**
- Supabase uses Row Level Security (RLS) policies
- Users can only access data they're authorized to see
- The database server enforces permissions, not the client

### Supabase Service Role Key (Secret)
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**What it is:**
- A private key with full database access
- Can bypass RLS policies
- Used for admin operations

**Security level:** 🔴 **Critical** - Never expose in client code

**Why it's dangerous:**
- Has full access to your database
- Can read, write, and delete any data
- Bypasses all security policies

## 🛡️ Security Best Practices

### ✅ DO These Things

#### 1. Use Environment Variables
```bash
# ✅ Good - Store in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# ✅ Good - Never commit .env.local to git
echo ".env.local" >> .gitignore
```

#### 2. Implement Row Level Security
```sql
-- ✅ Good - RLS policy example
CREATE POLICY "Users can only see their own profiles" ON profiles
  FOR ALL USING (auth.uid() = user_id);
```

#### 3. Validate Input on Server
```typescript
// ✅ Good - Server-side validation
export async function POST(request: Request) {
  const { email } = await request.json()
  
  // Validate email format
  if (!isValidEmail(email)) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }
  
  // Process request...
}
```

#### 4. Use Different Keys for Different Environments
```env
# Development
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key

# Production  
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

#### 5. Rotate Keys Regularly
- **Rotate every 90 days** minimum
- **Rotate immediately** if compromised
- **Use key versioning** for smooth transitions

### ❌ DON'T Do These Things

#### 1. Never Commit Keys to Version Control
```bash
# ❌ Bad - Never do this
git add .env.local
git commit -m "Add API keys"
git push
```

#### 2. Never Hardcode Keys in Source Code
```typescript
// ❌ Bad - Never hardcode keys
const supabase = createClient(
  'https://hardcoded-url.supabase.co',
  'hardcoded-key-here'
)
```

#### 3. Never Share Keys in Chat Messages
```
❌ Bad - Never share in Slack/Discord/email
"Hey, can you help me debug this? My key is eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 4. Never Trust Client-Side Validation Alone
```typescript
// ❌ Bad - Client validation only
function validateEmail(email: string) {
  return email.includes('@') // This can be bypassed!
}

// ✅ Good - Always validate on server too
```

#### 5. Never Use Production Keys in Development
```env
# ❌ Bad - Using production keys in dev
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
```

## 🔍 How API Keys Work in This Application

### Client-Side Usage (Safe)
```typescript
// This runs in the browser
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,     // Public URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Public anon key
)

// User can only access their own data due to RLS
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id) // RLS ensures they only see their data
```

### Server-Side Usage (More Secure)
```typescript
// This runs on the server
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,     // Public URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Public anon key
  // Service role key would go here for admin operations
)

// Server can perform admin operations
const { data } = await supabase
  .from('profiles')
  .select('*') // Can see all profiles (with proper authorization)
```

## 🚨 What Happens If Keys Are Compromised?

### Immediate Actions Required

1. **Revoke the compromised key** in your service dashboard
2. **Generate a new key** immediately
3. **Update your application** with the new key
4. **Monitor for unusual activity** in your logs
5. **Notify your team** if working with others

### Signs of Compromise

- **Unexpected API usage spikes**
- **Unusual data access patterns**
- **Failed authentication attempts**
- **Unexpected charges** on your service bill

## 🔧 Setting Up Secure API Keys

### Step 1: Create Environment Files
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your real values
nano .env.local
```

### Step 2: Configure Your Keys
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service role key (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 3: Verify Security
```bash
# Check that .env.local is in .gitignore
cat .gitignore | grep .env.local

# Verify keys are not in your code
grep -r "eyJ" src/ --exclude-dir=node_modules
```

## 🛠️ Tools for Key Management

### Environment Variable Managers
- **dotenv** - Load environment variables from files
- **cross-env** - Set environment variables cross-platform
- **env-cmd** - Run commands with environment variables

### Key Rotation Tools
- **Supabase CLI** - Manage Supabase projects and keys
- **GitHub Secrets** - Store keys securely in CI/CD
- **Vercel Environment Variables** - Deploy with secure keys

### Monitoring Tools
- **Supabase Dashboard** - Monitor API usage and errors
- **Application logs** - Track key usage patterns
- **Security scanners** - Detect exposed keys in code

## 📚 Additional Resources

### Supabase Security
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [RLS Policies Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [API Key Management](https://supabase.com/docs/guides/api/api-keys)

### General API Security
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [API Key Best Practices](https://swagger.io/resources/articles/best-practices-in-api-security/)
- [Environment Variable Security](https://12factor.net/config)

## 🆘 Getting Help

If you have security concerns:

1. **Read the documentation** first
2. **Check Supabase security guides**
3. **Join our Discord** for community help
4. **Email security@catalysttocourage.org** for critical issues
5. **Create a GitHub issue** for bugs

---

**Remember: Security is not optional. Every line of code is an opportunity to protect your users.** 🔒
