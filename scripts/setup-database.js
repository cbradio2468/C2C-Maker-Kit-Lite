#!/usr/bin/env node

/**
 * SETUP DATABASE CLI SCRIPT
 * 
 * This script helps users set up their database with the correct schema,
 * migrations, and sample data for their C2C application.
 * 
 * LEARNING GOALS:
 * - Understand database setup automation
 * - Learn migration management
 * - See database seeding patterns
 * - Understand environment configuration
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

// Helper function to colorize text
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

// Helper function to log messages
function log(message, color = 'reset') {
  console.log(colorize(message, color))
}

// Helper function to log errors
function logError(message) {
  console.error(colorize(`❌ ${message}`, 'red'))
}

// Helper function to log success
function logSuccess(message) {
  console.log(colorize(`✅ ${message}`, 'green'))
}

// Helper function to log info
function logInfo(message) {
  console.log(colorize(`ℹ️  ${message}`, 'blue'))
}

// Helper function to log warning
function logWarning(message) {
  console.log(colorize(`⚠️  ${message}`, 'yellow'))
}

// Main function to setup database
async function setupDatabase() {
  try {
    log('🗄️  C2C Community Starter Kit - Database Setup', 'cyan')
    log('===============================================', 'cyan')
    console.log()

    // Check if Supabase CLI is installed
    if (!await checkSupabaseCLI()) {
      logError('Supabase CLI is not installed')
      logInfo('Please install it first: https://supabase.com/docs/guides/cli')
      process.exit(1)
    }

    // Check if we're in a Supabase project
    if (!await isSupabaseProject()) {
      logError('This is not a Supabase project')
      logInfo('Please run "supabase init" first')
      process.exit(1)
    }

    // Get database configuration
    const config = await getDatabaseConfig()
    
    // Setup environment variables
    await setupEnvironmentVariables(config)
    
    // Start Supabase locally
    await startSupabaseLocal()
    
    // Apply migrations
    await applyMigrations()
    
    // Seed database
    await seedDatabase()
    
    // Generate types
    await generateTypes()
    
    // Display success message
    displaySuccessMessage(config)
    
  } catch (error) {
    logError(`Failed to setup database: ${error.message}`)
    process.exit(1)
  }
}

// Check if Supabase CLI is installed
async function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'pipe' })
    return true
  } catch (error) {
    return false
  }
}

// Check if we're in a Supabase project
async function isSupabaseProject() {
  return fs.existsSync('supabase')
}

// Get database configuration from user
async function getDatabaseConfig() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  logInfo('Database setup options:')
  log('  1. Use local Supabase (recommended for development)', 'yellow')
  log('  2. Connect to remote Supabase project', 'yellow')
  log('  3. Skip database setup', 'yellow')
  console.log()

  return new Promise((resolve) => {
    rl.question('Choose setup option (1-3): ', (answer) => {
      rl.close()
      const option = parseInt(answer.trim())
      const options = ['local', 'remote', 'skip']
      resolve(options[option - 1] || 'local')
    })
  })
}

// Setup environment variables
async function setupEnvironmentVariables(config) {
  const envPath = '.env.local'
  const envExamplePath = '.env.example'
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath)
      logSuccess('Created .env.local from .env.example')
    } else {
      // Create basic .env.local
      const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_database_url
`
      fs.writeFileSync(envPath, envContent)
      logSuccess('Created .env.local file')
    }
  }

  if (config === 'remote') {
    logInfo('Please update .env.local with your Supabase project credentials')
    logInfo('You can find these in your Supabase dashboard')
  }
}

// Start Supabase locally
async function startSupabaseLocal() {
  logInfo('Starting Supabase locally...')
  
  try {
    execSync('supabase start', { stdio: 'inherit' })
    logSuccess('Supabase started successfully')
  } catch (error) {
    logWarning('Failed to start Supabase locally')
    logInfo('Please check your Docker installation')
  }
}

// Apply migrations
async function applyMigrations() {
  logInfo('Applying database migrations...')
  
  try {
    // Check if migrations directory exists
    const migrationsDir = 'supabase/migrations'
    if (fs.existsSync(migrationsDir)) {
      execSync('supabase db reset', { stdio: 'inherit' })
      logSuccess('Database migrations applied successfully')
    } else {
      logWarning('No migrations found')
    }
  } catch (error) {
    logWarning('Failed to apply migrations')
    logInfo('Please check your migration files')
  }
}

// Seed database
async function seedDatabase() {
  logInfo('Seeding database...')
  
  try {
    // Check if seed file exists
    const seedFile = 'supabase/seed.sql'
    if (fs.existsSync(seedFile)) {
      execSync(`supabase db seed`, { stdio: 'inherit' })
      logSuccess('Database seeded successfully')
    } else {
      logWarning('No seed file found')
    }
  } catch (error) {
    logWarning('Failed to seed database')
    logInfo('Please check your seed file')
  }
}

// Generate types
async function generateTypes() {
  logInfo('Generating TypeScript types...')
  
  try {
    execSync('supabase gen types typescript --local > lib/types/supabase.ts', { stdio: 'inherit' })
    logSuccess('TypeScript types generated successfully')
  } catch (error) {
    logWarning('Failed to generate types')
    logInfo('Please run "supabase gen types typescript --local > lib/types/supabase.ts" manually')
  }
}

// Display success message
function displaySuccessMessage(config) {
  console.log()
  log('🎉 Database setup completed!', 'green')
  log('==============================', 'green')
  console.log()
  
  if (config === 'local') {
    log('Local Supabase is running at:', 'cyan')
    log('  API URL: http://localhost:54321', 'white')
    log('  Dashboard: http://localhost:54323', 'white')
    log('  Database: postgresql://postgres:postgres@localhost:54322/postgres', 'white')
    console.log()
  }
  
  log('Next steps:', 'yellow')
  log('1. Update your .env.local with the correct credentials', 'white')
  log('2. Run "pnpm dev" to start your application', 'white')
  log('3. Check the Supabase dashboard for your data', 'white')
  console.log()
  log('Happy coding! 🚀', 'magenta')
}

// Run the script
if (require.main === module) {
  setupDatabase().catch(console.error)
}

module.exports = { setupDatabase }
