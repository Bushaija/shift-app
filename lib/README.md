# API Client & Types for Mobile App

This directory contains the API client configuration and type definitions for your mobile app to communicate with your web app's API.

## Files

- **`api-client.ts`** - Hono client configuration with authentication and error handling
- **`api-types.ts`** - Comprehensive TypeScript types for all API endpoints and data structures

## Usage

### Basic API Client

The `apiClient` is a Hono client instance that provides type-safe access to your web app's API endpoints.

```typescript
import { apiClient } from './lib/api-client';

// Example: Get all nurses
const response = await apiClient.nurses.$get({ 
  query: { page: 1, limit: 10 } 
});

// Example: Get nurse by ID
const nurse = await apiClient.nurses[':id'].$get({ 
  param: { id: '123' } 
});

// Example: Create a new nurse
const newNurse = await apiClient.nurses.$post({
  json: {
    name: 'John Doe',
    email: 'john@example.com',
    departmentId: 1
  }
});
```

### Type Safety

All API endpoints are fully typed using the types defined in `api-types.ts`. This provides:

- **Request type safety** - TypeScript will catch errors in request data
- **Response type safety** - You know exactly what data structure to expect
- **Autocomplete** - IDE will suggest available endpoints and parameters

```typescript
import type { 
  Nurse, 
  CreateNurseRequest, 
  ApiRequest, 
  ApiResponse 
} from './lib/api-types';

// Type-safe request
const nurseData: CreateNurseRequest = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  departmentId: 1
};

// Type-safe response handling
const response: ApiResponse<Nurse> = await apiClient.nurses.$post({
  json: nurseData
});

if (response.success) {
  const nurse: Nurse = response.data!;
  console.log(`Created nurse: ${nurse.name}`);
}
```

### Authentication

The API client includes built-in token management:

```typescript
import { TokenManager, createAuthenticatedClient } from './lib/api-client';

// Set authentication token
TokenManager.setToken('your-jwt-token');

// Create authenticated client
const authClient = createAuthenticatedClient('your-jwt-token');

// Use authenticated client
const currentUser = await authClient.nurses.me.$get();
```

### Error Handling

The client includes comprehensive error handling:

```typescript
import { handleApiResponse, ApiError } from './lib/api-client';

try {
  const response = await apiClient.nurses.$get();
  const nurses = await handleApiResponse<Nurse[]>(response);
  console.log(`Found ${nurses.length} nurses`);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Available Endpoints

The API includes the following main endpoint groups:

#### Nurses (`/nurses`)
- `GET /nurses` - List all nurses with filtering
- `POST /nurses` - Create new nurse
- `GET /nurses/{id}` - Get nurse by ID
- `PUT /nurses/{id}` - Update nurse
- `DELETE /nurses/{id}` - Delete nurse
- `GET /nurses/me` - Get current user
- `GET /nurses/skills` - Get all skills
- `GET /nurses/{id}/availability` - Get nurse availability
- `PUT /nurses/{id}/availability` - Update nurse availability
- `GET /nurses/{id}/skills` - Get nurse skills
- `POST /nurses/{id}/skills` - Add skill to nurse
- `GET /nurses/{id}/fatigue` - Get nurse fatigue
- `POST /nurses/{id}/fatigue` - Create fatigue record

#### Shifts (`/shifts`)
- `GET /shifts` - List all shifts with filtering
- `POST /shifts` - Create new shift
- `POST /shifts/bulk` - Create multiple shifts
- `GET /shifts/{id}` - Get shift by ID
- `PUT /shifts/{id}` - Update shift
- `DELETE /shifts/{id}` - Delete shift
- `POST /shifts/{id}/auto-assign` - Auto-assign nurses
- `GET /shifts/{id}/assignments` - Get shift assignments
- `POST /shifts/{id}/assignments` - Create assignment
- `DELETE /shifts/{id}/assignments/{assignmentId}` - Remove assignment

#### Departments (`/departments`)
- `GET /departments` - List all departments
- `POST /departments` - Create new department
- `GET /departments/{id}` - Get department by ID
- `PUT /departments/{id}` - Update department
- `DELETE /departments/{id}` - Delete department

#### Attendance (`/attendance`)
- `GET /attendance` - List attendance records
- `POST /attendance` - Create attendance record
- `GET /attendance/{id}` - Get attendance by ID
- `PUT /attendance/{id}` - Update attendance

#### Notifications (`/notifications`)
- `GET /notifications` - List notifications
- `POST /notifications` - Create notification
- `GET /notifications/{id}` - Get notification by ID
- `PUT /notifications/{id}` - Mark as read

#### Swap Requests (`/swap-requests`)
- `GET /swap-requests` - List swap requests
- `POST /swap-requests` - Create swap request
- `GET /swap-requests/{id}` - Get swap request by ID
- `PUT /swap-requests/{id}` - Update status

#### Time-off Requests (`/time-off-requests`)
- `GET /time-off-requests` - List time-off requests
- `POST /time-off-requests` - Create time-off request
- `GET /time-off-requests/{id}` - Get time-off request by ID
- `PUT /time-off-requests/{id}` - Update status

#### Reports (`/reports`)
- `GET /reports` - Generate reports (JSON/CSV/PDF)

#### Outcomes (`/outcomes`)
- `GET /outcomes` - List outcomes
- `POST /outcomes` - Create outcome
- `GET /outcomes/{id}` - Get outcome by ID
- `PUT /outcomes/{id}` - Update outcome

### Data Types

All data structures are fully typed, including:

- **Nurse** - Complete nurse information with relationships
- **Shift** - Shift details with assignments
- **Department** - Department information
- **Attendance** - Attendance records
- **Notification** - System notifications
- **SwapRequest** - Shift swap requests
- **TimeOffRequest** - Time-off requests
- **ApiResponse<T>** - Standard API response wrapper
- **PaginationQuery/PaginationResponse** - Pagination support

### Configuration

The API client is configured for:
- **Base URL**: `http://localhost:3000/api` (development)
- **Timeout**: 10 seconds
- **Headers**: Content-Type, User-Agent
- **Authentication**: Bearer token support

For production, update the `baseURL` in `api-client.ts`:

```typescript
const API_CONFIG = {
  baseURL: 'https://your-production-domain.com/api',
  // ... other config
};
```

### Best Practices

1. **Always use types** - Import and use the provided types for type safety
2. **Handle errors** - Use try-catch blocks and check for `ApiError` instances
3. **Use authentication** - Set tokens for protected endpoints
4. **Validate responses** - Check `response.success` before accessing data
5. **Use pagination** - Include page/limit parameters for list endpoints

### Example: Complete Nurse Management

```typescript
import { apiClient, handleApiResponse } from './lib/api-client';
import type { Nurse, CreateNurseRequest } from './lib/api-types';

class NurseService {
  async getAllNurses(page = 1, limit = 20) {
    try {
      const response = await apiClient.nurses.$get({
        query: { page, limit }
      });
      return await handleApiResponse<Nurse[]>(response);
    } catch (error) {
      console.error('Failed to fetch nurses:', error);
      throw error;
    }
  }

  async createNurse(nurseData: CreateNurseRequest) {
    try {
      const response = await apiClient.nurses.$post({
        json: nurseData
      });
      return await handleApiResponse<Nurse>(response);
    } catch (error) {
      console.error('Failed to create nurse:', error);
      throw error;
    }
  }

  async getNurseById(id: string) {
    try {
      const response = await apiClient.nurses[':id'].$get({
        param: { id }
      });
      return await handleApiResponse<Nurse>(response);
    } catch (error) {
      console.error(`Failed to fetch nurse ${id}:`, error);
      throw error;
    }
  }
}

export const nurseService = new NurseService();
```

This setup provides a robust, type-safe way to interact with your web app's API from your mobile app.


