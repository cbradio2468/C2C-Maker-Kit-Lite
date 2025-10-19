#!/usr/bin/env node

/**
 * COMPLETE SETUP TEST
 * 
 * This script tests the complete C2C Community Starter Kit setup
 * to ensure everything is working correctly.
 * 
 * LEARNING GOALS:
 * - Understand comprehensive testing
 * - Learn setup verification patterns
 * - See integration testing approaches
 * - Understand error handling and reporting
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

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
}

// Main function to test complete setup
async function testCompleteSetup() {
  try {
    log('🧪 C2C Community Starter Kit - Complete Setup Test', 'cyan')
    log('==================================================', 'cyan')
    console.log()

    // Test project structure
    await testProjectStructure()
    
    // Test configuration files
    await testConfigurationFiles()
    
    // Test dependencies
    await testDependencies()
    
    // Test database setup
    await testDatabaseSetup()
    
    // Test application build
    await testApplicationBuild()
    
    // Test documentation
    await testDocumentation()
    
    // Test templates
    await testTemplates()
    
    // Test CLI scripts
    await testCLIScripts()
    
    // Test GitHub setup
    await testGitHubSetup()
    
    // Display results
    displayTestResults()
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`)
    process.exit(1)
  }
}

// Test project structure
async function testProjectStructure() {
  logInfo('Testing project structure...')
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.js',
    'tailwind.config.js',
    '.env.example',
    '.gitignore',
    'LICENSE',
    '.prettierrc',
    '.eslintrc.json',
    'postcss.config.js',
    'README.md'
  ]
  
  const requiredDirs = [
    'docs',
    'example-app',
    'templates',
    'scripts',
    '.github',
    'public'
  ]
  
  // Test required files
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      addTest('Project Structure', 'passed', `Required file ${file} exists`)
    } else {
      addTest('Project Structure', 'failed', `Required file ${file} missing`)
    }
  }
  
  // Test required directories
  for (const dir of requiredDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      addTest('Project Structure', 'passed', `Required directory ${dir} exists`)
    } else {
      addTest('Project Structure', 'failed', `Required directory ${dir} missing`)
    }
  }
}

// Test configuration files
async function testConfigurationFiles() {
  logInfo('Testing configuration files...')
  
  // Test package.json
  if (fs.existsSync('package.json')) {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      
      if (packageJson.name === 'c2c-community-starter') {
        addTest('Configuration', 'passed', 'Package name is correct')
      } else {
        addTest('Configuration', 'warning', 'Package name may need updating')
      }
      
      if (packageJson.scripts && packageJson.scripts.dev) {
        addTest('Configuration', 'passed', 'Development script exists')
      } else {
        addTest('Configuration', 'failed', 'Development script missing')
      }
      
      if (packageJson.dependencies && packageJson.dependencies.next) {
        addTest('Configuration', 'passed', 'Next.js dependency exists')
      } else {
        addTest('Configuration', 'failed', 'Next.js dependency missing')
      }
      
    } catch (error) {
      addTest('Configuration', 'failed', 'Invalid package.json format')
    }
  }
  
  // Test TypeScript configuration
  if (fs.existsSync('tsconfig.json')) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'))
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
        addTest('Configuration', 'passed', 'TypeScript strict mode enabled')
      } else {
        addTest('Configuration', 'warning', 'TypeScript strict mode not enabled')
      }
    } catch (error) {
      addTest('Configuration', 'failed', 'Invalid tsconfig.json format')
    }
  }
  
  // Test Tailwind configuration
  if (fs.existsSync('tailwind.config.js')) {
    addTest('Configuration', 'passed', 'Tailwind CSS configuration exists')
  } else {
    addTest('Configuration', 'failed', 'Tailwind CSS configuration missing')
  }
}

// Test dependencies
async function testDependencies() {
  logInfo('Testing dependencies...')
  
  try {
    // Check if node_modules exists
    if (fs.existsSync('node_modules')) {
      addTest('Dependencies', 'passed', 'Dependencies installed')
    } else {
      addTest('Dependencies', 'warning', 'Dependencies not installed (run pnpm install)')
    }
    
    // Check if pnpm-lock.yaml exists
    if (fs.existsSync('pnpm-lock.yaml')) {
      addTest('Dependencies', 'passed', 'pnpm lock file exists')
    } else {
      addTest('Dependencies', 'warning', 'pnpm lock file missing')
    }
    
  } catch (error) {
    addTest('Dependencies', 'failed', `Dependency check failed: ${error.message}`)
  }
}

// Test database setup
async function testDatabaseSetup() {
  logInfo('Testing database setup...')
  
  // Check for Supabase configuration
  if (fs.existsSync('supabase')) {
    addTest('Database', 'passed', 'Supabase configuration exists')
  } else {
    addTest('Database', 'warning', 'Supabase configuration missing')
  }
  
  // Check for database schema
  const schemaFile = 'example-app/database/schema.sql'
  if (fs.existsSync(schemaFile)) {
    addTest('Database', 'passed', 'Database schema exists')
    
    // Check for RLS policies
    const schemaContent = fs.readFileSync(schemaFile, 'utf8')
    if (schemaContent.includes('ROW LEVEL SECURITY')) {
      addTest('Database', 'passed', 'Row Level Security policies found')
    } else {
      addTest('Database', 'warning', 'No Row Level Security policies found')
    }
  } else {
    addTest('Database', 'failed', 'Database schema missing')
  }
  
  // Check for seed data
  const seedFile = 'example-app/database/seed.sql'
  if (fs.existsSync(seedFile)) {
    addTest('Database', 'passed', 'Database seed file exists')
  } else {
    addTest('Database', 'warning', 'Database seed file missing')
  }
}

// Test application build
async function testApplicationBuild() {
  logInfo('Testing application build...')
  
  try {
    // Check if example-app exists
    if (fs.existsSync('example-app')) {
      addTest('Application', 'passed', 'Example application exists')
      
      // Check for key components
      const components = [
        'example-app/app/layout.tsx',
        'example-app/app/page.tsx',
        'example-app/app/globals.css',
        'example-app/lib/supabase/client.ts',
        'example-app/lib/supabase/server.ts'
      ]
      
      for (const component of components) {
        if (fs.existsSync(component)) {
          addTest('Application', 'passed', `Component ${component} exists`)
        } else {
          addTest('Application', 'failed', `Component ${component} missing`)
        }
      }
    } else {
      addTest('Application', 'failed', 'Example application missing')
    }
    
  } catch (error) {
    addTest('Application', 'failed', `Application test failed: ${error.message}`)
  }
}

// Test documentation
async function testDocumentation() {
  logInfo('Testing documentation...')
  
  const requiredDocs = [
    'docs/00-WELCOME.md',
    'docs/01-GETTING-STARTED.md',
    'docs/02-MISSION-ALIGNMENT.md',
    'docs/03-DATABASE-DESIGN.md',
    'docs/04-BUILDING-YOUR-FIRST-APP.md',
    'docs/05-SECURITY-BASICS.md',
    'docs/06-NEXT-STEPS.md',
    'docs/EXAMPLES.md'
  ]
  
  for (const doc of requiredDocs) {
    if (fs.existsSync(doc)) {
      addTest('Documentation', 'passed', `Documentation ${doc} exists`)
    } else {
      addTest('Documentation', 'failed', `Documentation ${doc} missing`)
    }
  }
  
  // Check README
  if (fs.existsSync('README.md')) {
    const readmeContent = fs.readFileSync('README.md', 'utf8')
    if (readmeContent.includes('C2C Community Starter Kit')) {
      addTest('Documentation', 'passed', 'README contains project information')
    } else {
      addTest('Documentation', 'warning', 'README may need updating')
    }
  }
}

// Test templates
async function testTemplates() {
  logInfo('Testing templates...')
  
  const templates = [
    'templates/basic-crud-app',
    'templates/simple-dashboard',
    'templates/plugin-starter'
  ]
  
  for (const template of templates) {
    if (fs.existsSync(template)) {
      addTest('Templates', 'passed', `Template ${template} exists`)
      
      // Check for README
      if (fs.existsSync(`${template}/README.md`)) {
        addTest('Templates', 'passed', `Template ${template} has README`)
      } else {
        addTest('Templates', 'warning', `Template ${template} missing README`)
      }
    } else {
      addTest('Templates', 'failed', `Template ${template} missing`)
    }
  }
}

// Test CLI scripts
async function testCLIScripts() {
  logInfo('Testing CLI scripts...')
  
  const scripts = [
    'scripts/create-new-app.js',
    'scripts/setup-database.js',
    'scripts/check-security.js'
  ]
  
  for (const script of scripts) {
    if (fs.existsSync(script)) {
      addTest('CLI Scripts', 'passed', `Script ${script} exists`)
    } else {
      addTest('CLI Scripts', 'failed', `Script ${script} missing`)
    }
  }
}

// Test GitHub setup
async function testGitHubSetup() {
  logInfo('Testing GitHub setup...')
  
  const githubFiles = [
    '.github/CONTRIBUTING.md',
    '.github/CODE_OF_CONDUCT.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/ISSUE_TEMPLATE/feature_request.md',
    '.github/ISSUE_TEMPLATE/documentation.md'
  ]
  
  for (const file of githubFiles) {
    if (fs.existsSync(file)) {
      addTest('GitHub Setup', 'passed', `GitHub file ${file} exists`)
    } else {
      addTest('GitHub Setup', 'failed', `GitHub file ${file} missing`)
    }
  }
}

// Add a test result
function addTest(category, status, message) {
  testResults.tests.push({ category, status, message })
  
  if (status === 'passed') {
    testResults.passed++
  } else if (status === 'failed') {
    testResults.failed++
  } else if (status === 'warning') {
    testResults.warnings++
  }
}

// Display test results
function displayTestResults() {
  console.log()
  log('🧪 Test Results', 'cyan')
  log('==============', 'cyan')
  console.log()
  
  // Summary
  log(`Total tests: ${testResults.tests.length}`, 'white')
  log(`Passed: ${testResults.passed}`, 'green')
  log(`Failed: ${testResults.failed}`, 'red')
  log(`Warnings: ${testResults.warnings}`, 'yellow')
  console.log()
  
  // Detailed results by category
  const categories = [...new Set(testResults.tests.map(t => t.category))]
  
  for (const category of categories) {
    log(`${category}:`, 'blue')
    const categoryTests = testResults.tests.filter(t => t.category === category)
    
    for (const test of categoryTests) {
      const status = test.status === 'passed' ? '✅' : 
                     test.status === 'warning' ? '⚠️' : '❌'
      const color = test.status === 'passed' ? 'green' : 
                    test.status === 'warning' ? 'yellow' : 'red'
      
      log(`  ${status} ${test.message}`, color)
    }
    console.log()
  }
  
  // Overall result
  if (testResults.failed === 0) {
    if (testResults.warnings === 0) {
      log('🎉 All tests passed! Your setup is complete and ready to use.', 'green')
    } else {
      log('✅ Setup is functional with some warnings. Consider addressing the warnings.', 'yellow')
    }
  } else {
    log('❌ Some tests failed. Please fix the issues before proceeding.', 'red')
  }
  
  console.log()
  log('Next steps:', 'blue')
  log('1. Fix any failed tests', 'white')
  log('2. Address warnings if possible', 'white')
  log('3. Run "pnpm dev" to start development', 'white')
  log('4. Check the documentation for guidance', 'white')
  console.log()
}

// Run the test suite
if (require.main === module) {
  testCompleteSetup().catch(console.error)
}

module.exports = { testCompleteSetup }
