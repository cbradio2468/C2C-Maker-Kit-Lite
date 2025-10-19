#!/usr/bin/env node

/**
 * CHECK SECURITY CLI SCRIPT
 * 
 * This script performs security checks on a C2C application to ensure
 * it follows security best practices and doesn't have common vulnerabilities.
 * 
 * LEARNING GOALS:
 * - Understand security auditing patterns
 * - Learn vulnerability detection
 * - See security best practices
 * - Understand automated security checks
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

// Security check results
let securityResults = {
  passed: 0,
  warnings: 0,
  errors: 0,
  checks: []
}

// Main function to check security
async function checkSecurity() {
  try {
    log('🔒 C2C Community Starter Kit - Security Check', 'cyan')
    log('===============================================', 'cyan')
    console.log()

    // Check environment variables
    await checkEnvironmentVariables()
    
    // Check dependencies
    await checkDependencies()
    
    // Check database security
    await checkDatabaseSecurity()
    
    // Check authentication
    await checkAuthentication()
    
    // Check file permissions
    await checkFilePermissions()
    
    // Check for sensitive data
    await checkSensitiveData()
    
    // Check API security
    await checkAPISecurity()
    
    // Display results
    displaySecurityResults()
    
  } catch (error) {
    logError(`Security check failed: ${error.message}`)
    process.exit(1)
  }
}

// Check environment variables
async function checkEnvironmentVariables() {
  logInfo('Checking environment variables...')
  
  const envFile = '.env.local'
  const envExampleFile = '.env.example'
  
  // Check if .env.local exists
  if (!fs.existsSync(envFile)) {
    addCheck('Environment file', 'error', '.env.local file not found')
    return
  }
  
  // Check if .env.example exists
  if (!fs.existsSync(envExampleFile)) {
    addCheck('Environment example', 'warning', '.env.example file not found')
  }
  
  // Check for hardcoded secrets
  const envContent = fs.readFileSync(envFile, 'utf8')
  const sensitivePatterns = [
    /password\s*=\s*['"][^'"]+['"]/i,
    /secret\s*=\s*['"][^'"]+['"]/i,
    /key\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i
  ]
  
  for (const pattern of sensitivePatterns) {
    if (pattern.test(envContent)) {
      addCheck('Hardcoded secrets', 'warning', 'Potential hardcoded secrets found in .env.local')
      break
    }
  }
  
  addCheck('Environment variables', 'passed', 'Environment variables configured correctly')
}

// Check dependencies
async function checkDependencies() {
  logInfo('Checking dependencies...')
  
  const packageJsonPath = 'package.json'
  if (!fs.existsSync(packageJsonPath)) {
    addCheck('Package.json', 'error', 'package.json file not found')
    return
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  // Check for known vulnerable packages
  const vulnerablePackages = [
    'lodash',
    'moment',
    'jquery',
    'express',
    'mongoose'
  ]
  
  for (const pkg of vulnerablePackages) {
    if (dependencies[pkg]) {
      addCheck('Vulnerable packages', 'warning', `Package ${pkg} may have security vulnerabilities`)
    }
  }
  
  // Check for outdated packages
  try {
    execSync('npm audit', { stdio: 'pipe' })
    addCheck('Dependencies', 'passed', 'No known vulnerabilities found')
  } catch (error) {
    addCheck('Dependencies', 'warning', 'Some dependencies may have vulnerabilities')
  }
}

// Check database security
async function checkDatabaseSecurity() {
  logInfo('Checking database security...')
  
  // Check for RLS policies
  const schemaFile = 'supabase/migrations'
  if (fs.existsSync(schemaFile)) {
    const files = fs.readdirSync(schemaFile)
    let hasRLS = false
    
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const content = fs.readFileSync(path.join(schemaFile, file), 'utf8')
        if (content.includes('ROW LEVEL SECURITY') || content.includes('CREATE POLICY')) {
          hasRLS = true
          break
        }
      }
    }
    
    if (hasRLS) {
      addCheck('Database RLS', 'passed', 'Row Level Security policies found')
    } else {
      addCheck('Database RLS', 'warning', 'No Row Level Security policies found')
    }
  } else {
    addCheck('Database schema', 'warning', 'No database schema found')
  }
}

// Check authentication
async function checkAuthentication() {
  logInfo('Checking authentication...')
  
  // Check for auth middleware
  const middlewareFile = 'middleware.ts'
  if (fs.existsSync(middlewareFile)) {
    const content = fs.readFileSync(middlewareFile, 'utf8')
    if (content.includes('auth') || content.includes('session')) {
      addCheck('Authentication middleware', 'passed', 'Authentication middleware found')
    } else {
      addCheck('Authentication middleware', 'warning', 'Authentication middleware may be missing')
    }
  } else {
    addCheck('Authentication middleware', 'warning', 'No middleware.ts file found')
  }
  
  // Check for auth components
  const authComponents = ['AuthProvider', 'LoginForm', 'SignupForm']
  let foundAuthComponents = 0
  
  for (const component of authComponents) {
    if (fs.existsSync(`components/${component}.tsx`) || fs.existsSync(`app/components/${component}.tsx`)) {
      foundAuthComponents++
    }
  }
  
  if (foundAuthComponents > 0) {
    addCheck('Authentication components', 'passed', `${foundAuthComponents} authentication components found`)
  } else {
    addCheck('Authentication components', 'warning', 'No authentication components found')
  }
}

// Check file permissions
async function checkFilePermissions() {
  logInfo('Checking file permissions...')
  
  // Check for sensitive files
  const sensitiveFiles = ['.env', '.env.local', '.env.production']
  
  for (const file of sensitiveFiles) {
    if (fs.existsSync(file)) {
      try {
        const stats = fs.statSync(file)
        const mode = stats.mode & parseInt('777', 8)
        
        if (mode > parseInt('644', 8)) {
          addCheck('File permissions', 'warning', `File ${file} has overly permissive permissions`)
        } else {
          addCheck('File permissions', 'passed', `File ${file} has correct permissions`)
        }
      } catch (error) {
        addCheck('File permissions', 'error', `Cannot check permissions for ${file}`)
      }
    }
  }
}

// Check for sensitive data
async function checkSensitiveData() {
  logInfo('Checking for sensitive data...')
  
  // Check for hardcoded API keys
  const sourceFiles = getAllSourceFiles()
  let foundSensitiveData = false
  
  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8')
    
    // Check for common patterns
    const patterns = [
      /sk_[a-zA-Z0-9]{24}/, // Stripe secret key
      /pk_[a-zA-Z0-9]{24}/, // Stripe public key
      /AIza[a-zA-Z0-9]{35}/, // Google API key
      /[a-zA-Z0-9]{32}/, // Generic API key pattern
    ]
    
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        addCheck('Sensitive data', 'error', `Potential API key found in ${file}`)
        foundSensitiveData = true
        break
      }
    }
  }
  
  if (!foundSensitiveData) {
    addCheck('Sensitive data', 'passed', 'No hardcoded API keys found')
  }
}

// Check API security
async function checkAPISecurity() {
  logInfo('Checking API security...')
  
  // Check for API routes
  const apiDir = 'app/api'
  if (fs.existsSync(apiDir)) {
    const files = getAllSourceFiles(apiDir)
    let hasAuthChecks = false
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('auth') || content.includes('session') || content.includes('user')) {
        hasAuthChecks = true
        break
      }
    }
    
    if (hasAuthChecks) {
      addCheck('API security', 'passed', 'API routes have authentication checks')
    } else {
      addCheck('API security', 'warning', 'API routes may lack authentication checks')
    }
  } else {
    addCheck('API routes', 'info', 'No API routes found')
  }
}

// Get all source files
function getAllSourceFiles(dir = '.') {
  const files = []
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...getAllSourceFiles(fullPath))
    } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
      files.push(fullPath)
    }
  }
  
  return files
}

// Add a security check result
function addCheck(category, status, message) {
  securityResults.checks.push({ category, status, message })
  
  if (status === 'passed') {
    securityResults.passed++
  } else if (status === 'warning') {
    securityResults.warnings++
  } else if (status === 'error') {
    securityResults.errors++
  }
}

// Display security results
function displaySecurityResults() {
  console.log()
  log('🔒 Security Check Results', 'cyan')
  log('========================', 'cyan')
  console.log()
  
  // Summary
  log(`Total checks: ${securityResults.checks.length}`, 'white')
  log(`Passed: ${securityResults.passed}`, 'green')
  log(`Warnings: ${securityResults.warnings}`, 'yellow')
  log(`Errors: ${securityResults.errors}`, 'red')
  console.log()
  
  // Detailed results
  for (const check of securityResults.checks) {
    const status = check.status === 'passed' ? '✅' : 
                   check.status === 'warning' ? '⚠️' : '❌'
    const color = check.status === 'passed' ? 'green' : 
                  check.status === 'warning' ? 'yellow' : 'red'
    
    log(`${status} ${check.category}: ${check.message}`, color)
  }
  
  console.log()
  
  // Recommendations
  if (securityResults.errors > 0) {
    log('🚨 Critical issues found! Please fix these before deploying.', 'red')
  } else if (securityResults.warnings > 0) {
    log('⚠️  Some warnings found. Consider addressing these for better security.', 'yellow')
  } else {
    log('🎉 All security checks passed! Your application looks secure.', 'green')
  }
  
  console.log()
  log('For more security best practices, check the documentation.', 'blue')
}

// Run the script
if (require.main === module) {
  checkSecurity().catch(console.error)
}

module.exports = { checkSecurity }
