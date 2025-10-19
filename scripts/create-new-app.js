#!/usr/bin/env node

/**
 * CREATE NEW APP CLI SCRIPT
 * 
 * This script helps users create a new application using the C2C starter kit.
 * It scaffolds the basic project structure and configuration files.
 * 
 * LEARNING GOALS:
 * - Understand CLI tool development
 * - Learn project scaffolding patterns
 * - See file system operations
 * - Understand user interaction patterns
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

// Main function to create a new app
async function createNewApp() {
  try {
    log('🚀 C2C Community Starter Kit - Create New App', 'cyan')
    log('===============================================', 'cyan')
    console.log()

    // Get project name
    const projectName = await getProjectName()
    if (!projectName) {
      logError('Project name is required')
      process.exit(1)
    }

    // Get project description
    const projectDescription = await getProjectDescription()
    
    // Get project type
    const projectType = await getProjectType()
    
    // Get database preferences
    const databaseConfig = await getDatabaseConfig()
    
    // Get authentication preferences
    const authConfig = await getAuthConfig()
    
    // Create project directory
    const projectPath = path.join(process.cwd(), projectName)
    await createProjectDirectory(projectPath)
    
    // Copy template files
    await copyTemplateFiles(projectPath, projectType)
    
    // Update configuration files
    await updateConfigFiles(projectPath, {
      name: projectName,
      description: projectDescription,
      type: projectType,
      database: databaseConfig,
      auth: authConfig
    })
    
    // Install dependencies
    await installDependencies(projectPath)
    
    // Create initial commit
    await createInitialCommit(projectPath)
    
    // Display success message
    displaySuccessMessage(projectName, projectPath)
    
  } catch (error) {
    logError(`Failed to create app: ${error.message}`)
    process.exit(1)
  }
}

// Get project name from user
async function getProjectName() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('What is the name of your project? ', (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// Get project description from user
async function getProjectDescription() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('Describe your project (optional): ', (answer) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// Get project type from user
async function getProjectType() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  logInfo('Available project types:')
  log('  1. Basic CRUD App', 'yellow')
  log('  2. Simple Dashboard', 'yellow')
  log('  3. Plugin Starter', 'yellow')
  log('  4. Custom (from scratch)', 'yellow')
  console.log()

  return new Promise((resolve) => {
    rl.question('Choose a project type (1-4): ', (answer) => {
      rl.close()
      const type = parseInt(answer.trim())
      const types = ['basic-crud', 'dashboard', 'plugin', 'custom']
      resolve(types[type - 1] || 'custom')
    })
  })
}

// Get database configuration from user
async function getDatabaseConfig() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  logInfo('Database configuration:')
  log('  1. Use Supabase (recommended)', 'yellow')
  log('  2. Use local PostgreSQL', 'yellow')
  log('  3. Skip database setup', 'yellow')
  console.log()

  return new Promise((resolve) => {
    rl.question('Choose database option (1-3): ', (answer) => {
      rl.close()
      const option = parseInt(answer.trim())
      const options = ['supabase', 'local', 'none']
      resolve(options[option - 1] || 'supabase')
    })
  })
}

// Get authentication configuration from user
async function getAuthConfig() {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  logInfo('Authentication configuration:')
  log('  1. Enable authentication (recommended)', 'yellow')
  log('  2. Skip authentication setup', 'yellow')
  console.log()

  return new Promise((resolve) => {
    rl.question('Choose auth option (1-2): ', (answer) => {
      rl.close()
      const option = parseInt(answer.trim())
      resolve(option === 1)
    })
  })
}

// Create project directory
async function createProjectDirectory(projectPath) {
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory ${projectPath} already exists`)
  }
  
  fs.mkdirSync(projectPath, { recursive: true })
  logSuccess(`Created project directory: ${projectPath}`)
}

// Copy template files
async function copyTemplateFiles(projectPath, projectType) {
  const templatePath = path.join(__dirname, '..', 'templates', projectType)
  
  if (!fs.existsSync(templatePath)) {
    logWarning(`Template ${projectType} not found, using basic template`)
    return
  }
  
  // Copy template files recursively
  await copyDirectory(templatePath, projectPath)
  logSuccess(`Copied template files for ${projectType}`)
}

// Copy directory recursively
async function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true })
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      await copyDirectory(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Update configuration files
async function updateConfigFiles(projectPath, config) {
  // Update package.json
  const packageJsonPath = path.join(projectPath, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    packageJson.name = config.name
    packageJson.description = config.description
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  }
  
  // Update README.md
  const readmePath = path.join(projectPath, 'README.md')
  if (fs.existsSync(readmePath)) {
    let readme = fs.readFileSync(readmePath, 'utf8')
    readme = readme.replace(/{{PROJECT_NAME}}/g, config.name)
    readme = readme.replace(/{{PROJECT_DESCRIPTION}}/g, config.description)
    fs.writeFileSync(readmePath, readme)
  }
  
  logSuccess('Updated configuration files')
}

// Install dependencies
async function installDependencies(projectPath) {
  logInfo('Installing dependencies...')
  
  try {
    execSync('pnpm install', { 
      cwd: projectPath, 
      stdio: 'inherit' 
    })
    logSuccess('Dependencies installed successfully')
  } catch (error) {
    logWarning('Failed to install dependencies with pnpm, trying npm...')
    try {
      execSync('npm install', { 
        cwd: projectPath, 
        stdio: 'inherit' 
      })
      logSuccess('Dependencies installed successfully')
    } catch (npmError) {
      logWarning('Failed to install dependencies automatically')
      logInfo('Please run "pnpm install" or "npm install" in your project directory')
    }
  }
}

// Create initial commit
async function createInitialCommit(projectPath) {
  try {
    execSync('git init', { cwd: projectPath })
    execSync('git add .', { cwd: projectPath })
    execSync('git commit -m "Initial commit from C2C starter kit"', { cwd: projectPath })
    logSuccess('Created initial git commit')
  } catch (error) {
    logWarning('Failed to create initial git commit')
    logInfo('Please run "git init" and "git commit" manually')
  }
}

// Display success message
function displaySuccessMessage(projectName, projectPath) {
  console.log()
  log('🎉 Project created successfully!', 'green')
  log('================================', 'green')
  console.log()
  log(`Project name: ${projectName}`, 'cyan')
  log(`Project path: ${projectPath}`, 'cyan')
  console.log()
  log('Next steps:', 'yellow')
  log('1. cd ' + projectName, 'white')
  log('2. pnpm dev', 'white')
  log('3. Open http://localhost:3000', 'white')
  console.log()
  log('Happy coding! 🚀', 'magenta')
}

// Run the script
if (require.main === module) {
  createNewApp().catch(console.error)
}

module.exports = { createNewApp }
