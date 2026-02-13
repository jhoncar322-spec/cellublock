# Contributing to CelluBlock

Thank you for your interest in contributing to CelluBlock! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. A clear title and description
2. Steps to reproduce the bug
3. Expected behavior vs actual behavior
4. Screenshots (if applicable)
5. Environment details (OS, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain how it would benefit users
4. Consider implementation complexity

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests if applicable
5. Update documentation
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to your branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

See [README.md](README.md) for detailed setup instructions.

Quick start:

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow existing code style
- Use meaningful variable names
- Add type annotations where necessary
- Avoid `any` type when possible

### Backend

- Use async/await for asynchronous operations
- Handle errors properly with try/catch
- Use middleware for common functionality
- Follow RESTful API conventions
- Document API endpoints

### Frontend

- Use functional components with hooks
- Keep components small and focused
- Use Material-UI components consistently
- Handle loading and error states
- Make components reusable

### Git Commits

Use conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add device geolocation tracking
fix: resolve JWT token expiration issue
docs: update API documentation for device routes
```

## Project Structure

```
cellublock/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # Express routes
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Custom middleware
│   │   └── utils/       # Utility functions
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── contexts/    # React contexts
│   │   └── types/       # TypeScript types
└── docs/                # Additional documentation
```

## Testing

Currently, the project does not have automated tests. Contributions to add tests are highly welcome!

Potential testing frameworks:
- Backend: Jest, Mocha, Supertest
- Frontend: Jest, React Testing Library

## Documentation

- Update README.md for user-facing changes
- Update API_DOCUMENTATION.md for API changes
- Add code comments for complex logic
- Update TESTING_GUIDE.md for new features

## Security

- Never commit sensitive data (passwords, API keys, etc.)
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately to the maintainers

## Questions?

Feel free to open an issue for questions about contributing!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- The README.md file
- Release notes
- Project documentation

Thank you for making CelluBlock better! 🚀
