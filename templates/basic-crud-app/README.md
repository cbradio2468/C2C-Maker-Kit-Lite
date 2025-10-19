# Basic CRUD App Template

## What This Template Does

This template provides a complete CRUD (Create, Read, Update, Delete) application pattern that you can use as a starting point for your own projects.

## When to Use This Template

- Building a simple data management app
- Creating a content management system
- Building a user-generated content platform
- Learning CRUD operations with Next.js and Supabase

## What's Included

### Database Schema
- `items` table with basic fields
- Row-Level Security (RLS) policies
- Audit trail (created_at, updated_at)
- Soft delete support

### Components
- `ItemList` - Display list of items
- `ItemForm` - Create/edit form
- `ItemCard` - Individual item display

### Pages
- `/items` - List all items
- `/items/new` - Create new item
- `/items/[id]` - View item details
- `/items/[id]/edit` - Edit item

### Features
- Authentication required for create/edit
- Form validation
- Error handling
- Loading states
- Responsive design

## Quick Start

1. Copy the template files to your project
2. Update the database schema
3. Customize the fields for your use case
4. Update the component names and styling
5. Add your specific business logic

## Customization Guide

### 1. Update the Database Schema

```sql
-- Modify the items table for your needs
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

### 2. Update TypeScript Types

```typescript
export type Item = {
  id: string
  title: string
  description: string | null
  status: string
  created_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
```

### 3. Customize Components

- Update field names in forms
- Modify validation rules
- Change styling and layout
- Add new features as needed

## Security Considerations

- All operations require authentication
- Users can only edit their own items
- RLS policies protect data access
- Input validation on client and server

## Next Steps

1. **Add More Fields**: Extend the schema with additional fields
2. **Add Categories**: Create a categories table and relationship
3. **Add Search**: Implement search functionality
4. **Add Filters**: Add filtering and sorting options
5. **Add Images**: Support file uploads
6. **Add Comments**: Enable user comments on items

## Examples

This template can be adapted for:
- **Task Manager**: Tasks with due dates and priorities
- **Recipe App**: Recipes with ingredients and instructions
- **Event Planner**: Events with dates and locations
- **Inventory System**: Products with quantities and prices
- **Blog Platform**: Posts with content and categories

## Support

For questions about this template, check the main documentation or create an issue in the repository.
