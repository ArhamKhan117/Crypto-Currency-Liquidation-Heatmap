# Architecture Overview

## System Design

This application follows a modular client-side architecture with clear separation of concerns. The system is designed to be maintainable, scalable, and easy to understand.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Client                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Presentation Layer                     │ │
│  │  - HTML Structure (index.html)                     │ │
│  │  - CSS Styling (style.css)                         │ │
│  │  - Chart.js Visualization                          │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↕                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │           Application Logic Layer                   │ │
│  │  - State Management                                │ │
│  │  - Event Handlers                                  │ │
│  │  - UI Controllers                                  │ │
│  └────────────────────────────────────────────────────┘ │
│                          ↕                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Data Layer                            │ │
│  │  - API Client                                      │ │
│  │  - Data Processing                                 │ │
│  │  - Calculation Engine                              │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
              ┌───────────────────────┐
              │   External API        │
              │  (Future Integration) │
              └───────────────────────┘
```

## Component Architecture

### 1. Data Processing Module

**Responsibilities:**
- Parse raw liquidation data
- Separate long and short positions
- Calculate aggregate volumes
- Compute percentage differences
- Format data for display

**Key Functions:**
- `calculateTotal(liquidations, side)` - Aggregates volume by position type
- `processLiquidationData(rawData)` - Main processing pipeline
- `calculatePercentageDiff(longTotal, shortTotal)` - Computes market bias
- `formatCurrency(value)` - Formats USD values
- `formatPercentage(value)` - Formats percentage with sign

### 2. API Client Module

**Responsibilities:**
- Fetch liquidation data from external sources
- Handle network errors gracefully
- Manage request timeouts
- Support multiple cryptocurrencies
- Support multiple timeframes

**Current Implementation:**
- Mock data generation for demonstration
- Configurable timeframe support (1h, 4h, 24h)
- Error handling with fallback mechanisms

**Future Enhancements:**
- Integration with Coinglass API
- Integration with Binance API
- Rate limiting implementation
- Request caching

### 3. Chart Renderer Module

**Responsibilities:**
- Initialize Chart.js instance
- Configure chart appearance
- Update chart data dynamically
- Maintain responsive behavior

**Configuration:**
- Bar chart type for clear comparison
- Dark theme colors matching UI
- Responsive sizing
- Custom tooltips and labels

### 4. UI Controller Module

**Responsibilities:**
- Manage application state
- Handle user interactions
- Update DOM elements
- Display error messages
- Coordinate between modules

**State Management:**
```javascript
{
  currentSymbol: string,      // Selected cryptocurrency
  currentTimeframe: string,   // Selected timeframe
  chartInstance: Chart,       // Chart.js instance
  lastData: Object,          // Last successful data fetch
  isLoading: boolean         // Loading state
}
```

## Data Flow

### Request Flow
```
User Action → Event Handler → API Client → Data Processor → UI Update
```

### Detailed Flow
1. User selects cryptocurrency and timeframe
2. Event handler captures selection
3. API client fetches data for selected parameters
4. Data processor transforms raw data
5. Chart renderer updates visualization
6. Summary cards display formatted values
7. Error handler manages any failures

## Design Patterns

### Module Pattern
Each functional area is encapsulated in its own module with clear interfaces.

### Observer Pattern
UI components observe data changes and update accordingly.

### Strategy Pattern
Different calculation strategies for different cryptocurrencies and timeframes.

## Error Handling Strategy

### Levels of Error Handling

1. **Network Level**
   - Catch fetch errors
   - Handle timeouts
   - Retry logic (future)

2. **Data Level**
   - Validate API responses
   - Handle malformed data
   - Provide default values

3. **UI Level**
   - Display user-friendly messages
   - Preserve previous state on error
   - Auto-hide error messages

### Error Recovery
- Maintain last successful data
- Allow manual retry
- Graceful degradation

## Performance Considerations

### Current Optimizations
- Minimal DOM manipulation
- Efficient data filtering with native methods
- Chart updates instead of recreation
- CSS transitions for smooth animations

### Future Optimizations
- Data caching
- Request debouncing
- Virtual scrolling for large datasets
- Web Workers for heavy calculations

## Security Considerations

### Current Implementation
- Client-side only (no sensitive data)
- No user authentication required
- No data persistence

### Future Considerations
- API key management (if needed)
- Rate limiting
- Input sanitization
- CORS handling

## Scalability

### Current Limitations
- Client-side processing only
- No data persistence
- Limited to 5 cryptocurrencies

### Scaling Strategy
- Add backend API proxy
- Implement caching layer
- Add database for historical data
- Support unlimited cryptocurrencies
- Add user preferences storage

## Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js 4.4.0** - Data visualization

### Future Stack
- **Node.js + Express** - Backend API (optional)
- **Redis** - Caching layer
- **PostgreSQL** - Historical data storage

## File Structure

```
bitcoin-liquidation-tracker/
├── index.html              # Main HTML structure
├── style.css              # Styling and theming
├── script.js              # Application logic
├── README.md              # Project documentation
├── ARCHITECTURE.md        # This file
├── CONTRIBUTING.md        # Contribution guidelines
└── .gitignore            # Git ignore rules
```

## Module Dependencies

```
script.js
├── Data Processing Module (independent)
├── API Client Module (independent)
├── Chart Renderer Module (depends on Chart.js)
└── UI Controller Module (depends on all above)
```

## Testing Strategy

### Current State
- Manual testing in browser
- Visual verification

### Recommended Testing
- Unit tests for calculation functions
- Integration tests for data flow
- E2E tests for user interactions
- Visual regression tests

### Test Coverage Goals
- Data processing: 90%+
- API client: 80%+
- UI controllers: 70%+

## Deployment

### Current Deployment
- Static file hosting
- GitHub Pages compatible
- No build process required

### Production Deployment Options
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Monitoring and Logging

### Current Implementation
- Console logging for errors
- Basic error messages to users

### Future Implementation
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- User behavior tracking

## Maintenance

### Code Quality
- Consistent naming conventions
- Inline comments for complex logic
- Modular structure for easy updates

### Update Strategy
- Regular dependency updates
- API endpoint monitoring
- User feedback incorporation

## Known Technical Debt

1. Mock data instead of real API
2. No automated testing
3. No build process
4. Limited error recovery
5. No data caching
6. No loading indicators

## Future Roadmap

### Phase 1 (Current)
- ✅ Basic liquidation tracking
- ✅ Multiple timeframes
- ✅ Chart visualization
- ✅ Responsive design

### Phase 2 (Next)
- [ ] Real API integration
- [ ] Multiple cryptocurrencies
- [ ] Historical data view
- [ ] Loading indicators

### Phase 3 (Future)
- [ ] User preferences
- [ ] Data export
- [ ] Advanced filtering
- [ ] Real-time updates

### Phase 4 (Advanced)
- [ ] Backend API
- [ ] User accounts
- [ ] Alerts and notifications
- [ ] Mobile app
