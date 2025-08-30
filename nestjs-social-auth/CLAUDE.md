# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application implementing social authentication with multiple strategies including local email/password, Google OAuth, and JWT-based authentication with refresh tokens. The application uses MongoDB with Mongoose for data persistence and implements cookie-based session management.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (with hot reload)
pnpm run start:dev

# Build for production
pnpm run build

# Production server
pnpm run start:prod

# Run tests
pnpm run test              # Unit tests
pnpm run test:e2e          # End-to-end tests
pnpm run test:cov          # Test coverage

# Code quality
pnpm run lint              # ESLint
pnpm run format            # Prettier

# Docker
pnpm run docker:up         # Start MongoDB container
```

## Architecture Overview

### Authentication System
The authentication system implements a multi-strategy approach:

**Core Components:**
- **AuthModule**: Central authentication module coordinating all strategies
- **AuthService**: Handles token generation, user verification, and login logic
- **AuthController**: Exposes REST endpoints for authentication flows

**Authentication Strategies:**
- **LocalStrategy**: Email/password authentication using bcrypt
- **JwtStrategy**: JWT access token validation from cookies/headers
- **JwtRefreshStrategy**: Refresh token validation and rotation
- **GoogleStrategy**: Google OAuth 2.0 integration

**Guards:**
- **LocalAuthGuard**: Protects local login endpoints
- **JwtAuthGuard**: Protects routes requiring access token
- **JwtRefreshAuthGuard**: Protects refresh token endpoints
- **GoogleAuthGuard**: Handles Google OAuth flow

### Token Management
The application implements a dual-token system:
- **Access tokens**: Short-lived (configurable via JWT_ACCESS_TOKEN_EXPIRATION_MS)
- **Refresh tokens**: Long-lived, stored hashed in database
- **Cookie-based delivery**: HTTP-only cookies for XSS protection
- **Token rotation**: Refresh tokens are re-hashed on each use

### Database Schema
**User model (MongoDB):**
- `_id`: ObjectId (auto-generated)
- `email`: Unique identifier, required
- `password`: Bcrypt hashed (required, empty for OAuth users)
- `refreshToken`: Hashed refresh token (optional)

## Configuration Requirements

Environment variables needed:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/nestjs-social-auth

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRATION_MS=900000  # 15 minutes
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRATION_MS=86400000  # 24 hours

# Google OAuth
GOOGLE_AUTH_CLIENT_ID=your_google_client_id
GOOGLE_AUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_AUTH_REDIRECT_URL=http://localhost:3000/auth/google/callback

# Application
NODE_ENV=development
AUTH_UI_REDIRECT=http://localhost:3000/dashboard
```

## Key Implementation Details

### Authentication Flow
1. **Local Auth**: POST `/auth/login` with email/password → validates → sets cookies
2. **Google Auth**: GET `/auth/google` → OAuth flow → GET `/auth/google/callback` → sets cookies + redirects
3. **Token Refresh**: POST `/auth/refresh` with refresh cookie → validates → issues new tokens
4. **Protected Routes**: Use `@UseGuards(JwtAuthGuard)` + `@CurrentUser()` decorator

### Security Features
- Password hashing with bcrypt (salt rounds: 10)
- Refresh token hashing in database
- HTTP-only cookies prevent XSS
- Secure cookie flag in production
- Token expiration enforcement
- Input validation with class-validator

### Custom Decorators
- **@CurrentUser()**: Extracts authenticated user from request context

### Service Architecture
- **UsersService**: CRUD operations, user creation/retrieval
- **AuthService**: Authentication logic, token management
- Dependency injection between auth and users modules

## Testing Strategy

The project includes comprehensive test coverage:
- Unit tests for services and controllers
- E2E tests for authentication flows
- Jest configuration for TypeScript
- Supertest for HTTP testing

## Development Notes

- Uses PNPM as package manager
- TypeScript with strict configuration
- ESLint + Prettier for code quality
- Mongoose for MongoDB ODM
- Passport.js for authentication strategies
- Cookie-parser middleware for cookie handling
- ConfigService for environment variable management