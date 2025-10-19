# Database Migrations

This directory contains database migration files for the Resource Finder example application.

## What are Migrations?

Migrations are scripts that modify your database schema over time. They allow you to:
- Add new tables or columns
- Modify existing structures
- Update data
- Roll back changes if needed

## Migration Files

Currently, this directory is empty because the initial schema is created by `schema.sql`.

## Future Migrations

As you develop your application, you might need migrations for:

- Adding new features
- Updating data structures
- Adding indexes for performance
- Modifying RLS policies

## Example Migration Structure

```sql
-- migration_001_add_user_preferences.sql
-- Add user preferences table for enhanced personalization

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_frequency TEXT DEFAULT 'weekly',
  preferred_categories UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Add policy
CREATE POLICY "Users can manage their own preferences"
  ON public.user_preferences
  FOR ALL
  USING (auth.uid() = user_id);
```

## Running Migrations

1. Create your migration file
2. Run it in Supabase SQL Editor
3. Test your application
4. Commit the migration file to version control

## Best Practices

- Always backup your database before running migrations
- Test migrations on a copy of your production data first
- Use descriptive names for migration files
- Include rollback instructions in comments
- Never modify existing migration files after they've been run
