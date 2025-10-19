# Contributing to C2C Community Starter Kit

Thank you for your interest in contributing to the Catalyst To Courage Community Starter Kit! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Git
- A GitHub account
- Basic knowledge of Next.js, Supabase, and TypeScript

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `pnpm install`
4. Set up environment variables (see `.env.example`)
5. Start the development server: `pnpm dev`

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Report issues you've found
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Fix bugs, implement features, improve documentation
- **Documentation**: Improve existing docs or add new ones
- **Examples**: Add new example applications or templates
- **Templates**: Create new starter templates

### Reporting Issues

Before creating an issue, please:

1. Check if the issue already exists
2. Use the appropriate issue template
3. Provide clear steps to reproduce
4. Include relevant environment information

### Suggesting Features

When suggesting features:

1. Check if the feature has been requested before
2. Use the feature request template
3. Explain the problem you're trying to solve
4. Describe your proposed solution
5. Consider the impact on the project's mission

## Development Process

### Branch Naming

Use descriptive branch names:

- `fix/description` for bug fixes
- `feature/description` for new features
- `docs/description` for documentation updates
- `refactor/description` for code refactoring

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Follow the project's ESLint and Prettier configuration
- Write meaningful variable and function names
- Add comments for complex logic

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test your changes thoroughly
- Consider edge cases and error scenarios

## Pull Request Process

### Before Submitting

1. Ensure your code follows the project's style guidelines
2. Run the linter: `pnpm lint`
3. Run tests: `pnpm test`
4. Update documentation if needed
5. Test your changes in different scenarios

### Pull Request Guidelines

1. Use a clear, descriptive title
2. Provide a detailed description of your changes
3. Reference any related issues
4. Include screenshots for UI changes
5. Ensure the PR is up to date with the main branch

### Review Process

- All PRs require review before merging
- Address feedback promptly
- Be open to suggestions and improvements
- Ask questions if anything is unclear

## Issue Guidelines

### Bug Reports

Use the bug report template and include:

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Screenshots if applicable

### Feature Requests

Use the feature request template and include:

- Clear description of the feature
- Problem it solves
- Proposed solution
- Alternative solutions considered
- Additional context

## Community Guidelines

### Communication

- Be respectful and constructive
- Use inclusive language
- Help others learn and grow
- Share knowledge and experiences

### Getting Help

- Check the documentation first
- Search existing issues and discussions
- Ask questions in discussions or issues
- Be patient with responses

### Recognition

Contributors will be recognized in:

- The project's README
- Release notes
- Contributor hall of fame
- Social media acknowledgments

## Development Setup

### Local Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables
4. Start Supabase locally: `supabase start`
5. Run the development server: `pnpm dev`

### Database Setup

1. Start Supabase: `supabase start`
2. Apply migrations: `supabase db reset`
3. Seed data: `supabase db seed`
4. Generate types: `supabase gen types typescript --local > lib/types/supabase.ts`

### Testing

- Run tests: `pnpm test`
- Run linting: `pnpm lint`
- Check formatting: `pnpm check-format`
- Run security checks: `node scripts/check-security.js`

## Release Process

### Versioning

We follow semantic versioning (SemVer):

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes (backward compatible)

### Release Steps

1. Update version numbers
2. Update CHANGELOG.md
3. Create release notes
4. Tag the release
5. Publish to npm (if applicable)

## Contact

- **Issues**: Use GitHub issues
- **Discussions**: Use GitHub discussions
- **Email**: [Your email here]
- **Discord**: [Your Discord server here]

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to the C2C Community Starter Kit! Together, we can build amazing mission-driven applications. 🚀
