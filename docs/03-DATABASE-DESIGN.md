# Database Design for Impact

## 🗄️ Why Database Design Matters

Your database is the foundation of your application. Get it wrong, and everything else becomes harder. Get it right, and your app will be secure, fast, and maintainable.

**The C2C Approach**: Design your database to serve your users, not just store information.

## 🎯 Database Design Principles

### 1. **User-Centric Design**
Start with WHO will use this data, not WHAT data you want to store.

❌ **Wrong**: "I need a users table, a posts table, a comments table..."  
✅ **Right**: "My users need to find resources quickly, so I'll optimize for search"

### 2. **Privacy-First**
Assume your users' data will be compromised. Design accordingly.

- Use Row-Level Security (RLS) on every table
- Don't store sensitive data unless absolutely necessary
- Plan for data deletion (GDPR compliance)
- Encrypt sensitive fields

### 3. **Accessibility Considerations**
Your database design affects accessibility:

- Support multiple languages from day one
- Store alternative formats (audio, braille)
- Include accessibility metadata
- Plan for assistive technology needs

### 4. **Performance for Real Users**
Optimize for the devices your users actually have:

- Index frequently searched fields
- Use efficient data types
- Plan for slow internet connections
- Design for mobile-first

## 📊 Understanding Our Resource Finder Schema

Let's walk through the database design for our Resource Finder example:

### Core Tables

#### 1. **profiles** - User Information
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Why this design:**
- Extends Supabase's built-in `auth.users` table
- Stores only essential user information
- Includes language preference for accessibility
- Automatic timestamps for audit trails

#### 2. **resource_categories** - Predefined Categories
```sql
CREATE TABLE resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- emoji or icon name
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Why this design:**
- Separate table allows easy category management
- Slug field for SEO-friendly URLs
- Display order for consistent UI
- Icons for visual accessibility

#### 3. **resources** - Main Data Table
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Information
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES resource_categories(id),
  
  -- Contact Information
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Location Information
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Eligibility & Requirements
  eligibility_criteria TEXT,
  documents_required TEXT,
  languages_spoken TEXT[],
  
  -- Multi-language Support
  name_es TEXT,
  description_es TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id),
  verified_by UUID REFERENCES profiles(id),
  is_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL -- soft delete
);
```

**Why this design:**
- Comprehensive contact information
- Geographic data for mapping
- Multi-language support built-in
- Verification system for quality control
- Soft deletes preserve data for analytics

### Supporting Tables

#### 4. **resource_views** - Impact Tracking
```sql
CREATE TABLE resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);
```

**Why this design:**
- Track which resources are actually helpful
- Anonymous analytics (user_id can be NULL)
- IP address for geographic insights
- Cascade delete when resource is removed

#### 5. **resource_feedback** - Quality Control
```sql
CREATE TABLE resource_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  was_helpful BOOLEAN,
  feedback_text TEXT,
  issue_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Why this design:**
- Users can report issues or confirm helpfulness
- Structured feedback for easy analysis
- Optional user identification
- Automatic timestamps

## 🔒 Row-Level Security (RLS) Explained

RLS is PostgreSQL's built-in security feature. It ensures users can only access data they're allowed to see, even if your application code has bugs.

### How RLS Works

1. **Enable RLS** on a table
2. **Create policies** that define who can access what
3. **PostgreSQL automatically enforces** these policies on every query

### Example RLS Policies

#### Profiles Table
```sql
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

#### Resources Table
```sql
-- Everyone can view non-deleted resources
CREATE POLICY "Resources are viewable by everyone"
  ON resources
  FOR SELECT
  USING (deleted_at IS NULL);

-- Only authenticated users can create resources
CREATE POLICY "Authenticated users can create resources"
  ON resources
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only update their own resources
CREATE POLICY "Users can update their own resources"
  ON resources
  FOR UPDATE
  USING (auth.uid() = created_by);
```

### Why RLS is Important

**Without RLS**: If your app has a bug, users might see other users' data  
**With RLS**: Even if your app has bugs, PostgreSQL prevents unauthorized access

## 🚀 Performance Optimization

### Indexes for Search

```sql
-- Full-text search index
CREATE INDEX idx_resources_search 
  ON resources 
  USING gin(to_tsvector('english', name || ' ' || description));

-- Category filtering index
CREATE INDEX idx_resources_category 
  ON resources(category_id);

-- Location-based queries index
CREATE INDEX idx_resources_location 
  ON resources(city, state);
```

**Why these indexes:**
- Full-text search is fast even with thousands of resources
- Category filtering doesn't require table scans
- Location queries are optimized for mapping features

### Query Optimization Tips

1. **Use specific columns** in SELECT statements
2. **Add LIMIT** to prevent large result sets
3. **Use WHERE clauses** to filter early
4. **Consider pagination** for large datasets

## 🔄 Data Relationships

### Foreign Keys
Foreign keys ensure data integrity and enable powerful queries:

```sql
-- A resource belongs to a category
category_id UUID REFERENCES resource_categories(id)

-- A resource was created by a user
created_by UUID REFERENCES profiles(id)

-- Views are linked to resources and users
resource_id UUID REFERENCES resources(id) ON DELETE CASCADE
user_id UUID REFERENCES profiles(id) ON DELETE SET NULL
```

### Cascade Behaviors
- **CASCADE**: When parent is deleted, delete children
- **SET NULL**: When parent is deleted, set child to NULL
- **RESTRICT**: Prevent deletion if children exist

## 📱 Mobile-First Considerations

### Data Types
- Use `TEXT` instead of `VARCHAR` (more flexible)
- Store coordinates as `DECIMAL` (precise, not floating point)
- Use `TIMESTAMP WITH TIME ZONE` (handles timezones correctly)

### Query Patterns
- Design for slow connections
- Minimize data transfer
- Use pagination for large lists
- Cache frequently accessed data

## 🛡️ Security Best Practices

### 1. **Never Trust Client Data**
- Validate all input on the server
- Use parameterized queries (Supabase does this automatically)
- Sanitize user-generated content

### 2. **Plan for Data Breaches**
- Encrypt sensitive fields
- Use strong passwords for database access
- Monitor for unusual access patterns
- Have a data breach response plan

### 3. **Compliance Considerations**
- GDPR: Users can request data deletion
- CCPA: Users can opt out of data collection
- HIPAA: If handling health data, use proper encryption

## 🧪 Testing Your Database Design

### 1. **Test RLS Policies**
```sql
-- Test as different users
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "user-uuid"}';

-- Try to access data you shouldn't see
SELECT * FROM profiles WHERE id != 'user-uuid';
-- Should return empty result
```

### 2. **Test Performance**
```sql
-- Check query execution plans
EXPLAIN ANALYZE SELECT * FROM resources 
WHERE name ILIKE '%food%' 
ORDER BY created_at DESC 
LIMIT 20;
```

### 3. **Test Data Integrity**
```sql
-- Try to create invalid relationships
INSERT INTO resources (category_id) VALUES ('invalid-uuid');
-- Should fail with foreign key constraint error
```

## 📋 Database Design Checklist

Before you start coding, verify:

```
□ Every table has a clear purpose
□ RLS is enabled on all tables
□ Foreign key relationships are defined
□ Indexes exist for common queries
□ Timestamps are included for audit trails
□ Soft deletes are implemented where needed
□ Multi-language support is planned
□ Performance is considered for mobile users
□ Security policies are tested
□ Data types are appropriate
□ Compliance requirements are met
```

## 🎯 Common Database Mistakes

### Mistake #1: No RLS Policies
**Problem**: Users can access any data  
**Solution**: Enable RLS and create appropriate policies

### Mistake #2: Missing Indexes
**Problem**: Slow queries as data grows  
**Solution**: Add indexes for frequently searched fields

### Mistake #3: Hard Deletes
**Problem**: Lost data, broken analytics  
**Solution**: Use soft deletes with `deleted_at` field

### Mistake #4: No Audit Trail
**Problem**: Can't track changes or debug issues  
**Solution**: Add `created_at` and `updated_at` to all tables

### Mistake #5: Poor Data Types
**Problem**: Data corruption, performance issues  
**Solution**: Use appropriate PostgreSQL data types

## 🚀 Next Steps

Now that you understand database design:

1. **Study the Resource Finder schema** in detail
2. **Design your own database** using these principles
3. **Test your RLS policies** thoroughly
4. **Plan for performance** from the start

---

**Remember**: Good database design makes everything else easier. Take your time here.

Next: [Building Your First App →](./04-BUILDING-YOUR-FIRST-APP.md)
