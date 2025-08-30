# Nurse Authentication System

This document describes the implementation of the nurse authentication system for the Shift-Med mobile app.

## Overview

The nurse authentication system provides a simple email/password-based authentication without access tokens, designed specifically for healthcare staff management.

## Features

### 1. Login Screen (`/auth/signin`)
- **Email**: Pre-filled with `admin@gmail.com`
- **Password**: User enters their password
- **Demo Button**: Quick login with default credentials
- **Validation**: Basic input validation and error handling

### 2. Force Password Change Screen (`/force-password-change`)
- **Triggered**: On first login with default password `auca#123`
- **Fields**: Current password, new password, confirm password
- **Validation**: Strong password requirements
- **Redirect**: Automatically redirects to home after successful change

### 3. Home Screen Integration
- **Nurse Profile Card**: Displays nurse information and stats
- **Personalized Greeting**: Shows nurse name and specialization
- **Statistics**: Max hours, seniority points, fatigue score

## Authentication Flow

```
1. App Launch → Check Authentication Status
2. If not authenticated → Show Login Screen
3. Login with default password → Force Password Change
4. Login with changed password → Home Screen
5. Subsequent logins → Direct to Home Screen
```

## Default Credentials

- **Email**: `admin@gmail.com`
- **Default Password**: `auca#123`

## Password Requirements

New passwords must meet the following criteria:
- At least 8 characters long
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&*)

## API Integration

The system integrates with the nurse API endpoint:
- **GET** `/api/nurses/1` - Fetches nurse data for authentication

## Data Structure

### Nurse Interface
```typescript
interface Nurse {
  worker_id: number;
  user: NurseUser;
  employee_id: string;
  specialization: string;
  license_number: string;
  base_hourly_rate: string;
  max_hours_per_week: number;
  seniority_points: number;
  fatigue_score: number;
  // ... other fields
}
```

## State Management

The authentication state is managed using Zustand with the following key properties:
- `isAuthenticated`: Boolean indicating login status
- `requiresPasswordChange`: Boolean indicating if password change is required
- `nurse`: Nurse data object
- `isFirstLogin`: Boolean indicating first-time login

## Navigation Flow

```
/ → /auth/signin → /force-password-change → /(tabs) (Home)
```

## Testing

Run the authentication tests:
```bash
npm test nurse-auth.test.tsx
```

## Security Considerations

1. **Password Storage**: In production, passwords should be hashed and stored securely
2. **API Security**: Implement proper API authentication and rate limiting
3. **Session Management**: Consider implementing session timeouts
4. **Input Validation**: All user inputs are validated on both client and server

## Future Enhancements

1. **Biometric Authentication**: Add fingerprint/face ID support
2. **Multi-Factor Authentication**: Implement SMS/email verification
3. **Password Reset**: Add forgot password functionality
4. **Session Management**: Implement proper session handling
5. **Audit Logging**: Track authentication events for security

## Troubleshooting

### Common Issues

1. **Login Fails**: Check if the nurse API endpoint is accessible
2. **Password Change Error**: Ensure new password meets all requirements
3. **Navigation Issues**: Verify route configuration in `_layout.tsx`

### Debug Mode

Enable debug logging by setting environment variables:
```bash
DEBUG_AUTH=true
```

## Support

For technical support or questions about the authentication system, please contact the development team or refer to the API documentation.

