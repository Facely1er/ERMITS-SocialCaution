# Contributing to Social Caution

Thank you for your interest in contributing to Social Caution! We welcome contributions from the community.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/social-caution.git
   cd social-caution
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Follow the existing ESLint configuration
- Use TypeScript for all new code
- Follow React best practices
- Use meaningful variable and function names
- Add comments for complex logic

### Git Workflow
1. Create a feature branch from `main`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Commit Messages
Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test additions/changes

Example: `feat: add privacy assessment tool`

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── services/      # API services
├── store/         # State management
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── styles/        # CSS styles
```

## Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests
- Write unit tests for utility functions
- Write component tests for React components
- Write integration tests for API endpoints
- Aim for >80% code coverage

## Pull Request Process

1. Ensure your code follows the style guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Ensure all CI checks pass
5. Request review from maintainers

### PR Template
- Description of changes
- Screenshots (if UI changes)
- Testing instructions
- Breaking changes (if any)

## Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details
- Screenshots (if applicable)

## Feature Requests

For feature requests:
- Check existing issues first
- Provide clear use cases
- Consider implementation complexity
- Discuss with maintainers before major work

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be constructive in feedback
- Focus on what's best for the community

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Personal attacks
- Spam or off-topic discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open an issue for questions
- Join our community discussions
- Contact maintainers directly

Thank you for contributing to Social Caution!