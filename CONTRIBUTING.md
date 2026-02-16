# Contributing to Bitcoin Liquidation Tracker

Thanks for considering contributing to this project! This document outlines the process and guidelines.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bitcoin-liquidation-tracker.git
cd bitcoin-liquidation-tracker

# Open in browser
# Just open index.html in your browser - no build process needed!
```

## Code Style

### JavaScript
- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use descriptive variable names
- Add comments for complex logic
- Keep functions small and focused

### CSS
- Use CSS variables for theming
- Follow BEM naming where appropriate
- Keep selectors specific but not overly nested
- Mobile-first responsive design

### HTML
- Semantic HTML5 elements
- Accessible markup (ARIA labels where needed)
- Keep structure clean and readable

## Making Changes

### Adding a New Feature

1. Check existing issues or create a new one
2. Discuss the feature before implementing
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Implement the feature
5. Test on multiple browsers
6. Update documentation if needed
7. Submit a pull request

### Fixing a Bug

1. Create a bug report issue if one doesn't exist
2. Create a bugfix branch: `git checkout -b fix/bug-description`
3. Fix the bug
4. Test the fix
5. Submit a pull request referencing the issue

### Improving Documentation

Documentation improvements are always welcome! This includes:
- README updates
- Code comments
- Architecture documentation
- Examples and tutorials

## Testing

Currently, testing is manual. When testing your changes:

1. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
2. Test on different screen sizes (mobile, tablet, desktop)
3. Test all timeframe options
4. Test all cryptocurrency options
5. Test error scenarios (network failures, etc.)
6. Verify chart updates correctly
7. Check console for errors

## Pull Request Process

1. Update the README.md if needed
2. Ensure your code follows the style guidelines
3. Test your changes thoroughly
4. Write a clear PR description explaining:
   - What changes you made
   - Why you made them
   - How to test them
5. Link any related issues
6. Wait for review

## Commit Messages

Write clear, concise commit messages:

```
Good:
- "add ethereum support to cryptocurrency selector"
- "fix percentage calculation for zero values"
- "improve mobile responsiveness for summary cards"

Not so good:
- "update"
- "fix bug"
- "changes"
```

## Code Review

All submissions require review. We'll look for:
- Code quality and readability
- Adherence to style guidelines
- Proper error handling
- Browser compatibility
- Performance implications
- Security considerations

## Areas for Contribution

### High Priority
- Real API integration (Coinglass, Binance)
- Automated testing setup
- Loading indicators
- Error recovery improvements

### Medium Priority
- Additional cryptocurrencies
- Historical data view
- Data export functionality
- Performance optimizations

### Low Priority
- UI enhancements
- Additional chart types
- Themes/customization
- Keyboard shortcuts

## Questions?

Feel free to open an issue with the "question" label if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
