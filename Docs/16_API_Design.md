# 16_API_Design.md

# MB Tech Labs - API Design

## Overview

The API Design for MB Tech Labs follows RESTful principles and provides comprehensive programmatic access to all platform functionality. The API is designed for scalability, security, and ease of integration, supporting the frontend application, mobile apps, and third-party integrations.

## API Architecture

### Core Principles
- **RESTful Design**: Standard HTTP methods and resource-based URLs
- **JSON Format**: Consistent data interchange format
- **Versioning**: API version management for backward compatibility
- **Stateless**: No server-side session state management
- **HATEOAS**: Hypermedia as the Engine of Application State

### Base Configuration
- **Base URL**: `https://api.mbtechlabs.com/v1/`
- **Authentication**: JWT Bearer tokens or API keys
- **Content-Type**: `application/json`
- **Rate Limiting**: Configurable per endpoint
- **CORS**: Cross-origin resource sharing enabled

## Authentication

### JWT Authentication
**Endpoint**: `POST /auth/login`
**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "client"
    }
  }
}
```

### API Key Authentication
**Headers**:
```
Authorization: Bearer API_KEY_HERE
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "req_123456789",
    "version": "v1"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "req_123456789"
  }
}
```

## API Endpoints

### Authentication Endpoints

#### Login
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticate user and return JWT tokens

#### Refresh Token
- **Method**: `POST`
- **Endpoint**: `/auth/refresh`
- **Description**: Refresh expired access token

#### Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Description**: Invalidate current session

#### Password Reset
- **Method**: `POST`
- **Endpoint**: `/auth/password-reset`
- **Description**: Initiate password reset process

### User Management Endpoints

#### Get Current User
- **Method**: `GET`
- **Endpoint**: `/users/me`
- **Description**: Get current authenticated user information

#### Update Profile
- **Method**: `PUT`
- **Endpoint**: `/users/me`
- **Description**: Update user profile information

#### List Users
- **Method**: `GET`
- **Endpoint**: `/users`
- **Description**: Get list of users (admin only)
- **Query Parameters**: `page`, `limit`, `search`, `role`

#### Get User
- **Method**: `GET`
- **Endpoint**: `/users/{id}`
- **Description**: Get specific user information

### Project Management Endpoints

#### List Projects
- **Method**: `GET`
- **Endpoint**: `/projects`
- **Description**: Get user's projects
- **Query Parameters**: `page`, `limit`, `status`, `client_id`

#### Create Project
- **Method**: `POST`
- **Endpoint**: `/projects`
- **Description**: Create new project

**Request Body**:
```json
{
  "name": "E-commerce Website",
  "description": "Build a modern e-commerce platform",
  "client_id": 1,
  "budget": 50000.00,
  "start_date": "2024-02-01",
  "end_date": "2024-06-01"
}
```

#### Get Project
- **Method**: `GET`
- **Endpoint**: `/projects/{id}`
- **Description**: Get project details

#### Update Project
- **Method**: `PUT`
- **Endpoint**: `/projects/{id}`
- **Description**: Update project information

#### Delete Project
- **Method**: `DELETE`
- **Endpoint**: `/projects/{id}`
- **Description**: Delete project

### Task Management Endpoints

#### List Tasks
- **Method**: `GET`
- **Endpoint**: `/projects/{project_id}/tasks`
- **Description**: Get project tasks
- **Query Parameters**: `page`, `limit`, `status`, `assigned_to`

#### Create Task
- **Method**: `POST`
- **Endpoint**: `/projects/{project_id}/tasks`
- **Description**: Create new task

**Request Body**:
```json
{
  "title": "Design homepage mockup",
  "description": "Create wireframes and mockups for the homepage",
  "assigned_to": 2,
  "priority": "high",
  "estimated_hours": 16.0,
  "due_date": "2024-02-15"
}
```

#### Get Task
- **Method**: `GET`
- **Endpoint**: `/tasks/{id}`
- **Description**: Get task details

#### Update Task
- **Method**: `PUT`
- **Endpoint**: `/tasks/{id}`
- **Description**: Update task information

#### Delete Task
- **Method**: `DELETE`
- **Endpoint**: `/tasks/{id}`
- **Description**: Delete task

### Billing Endpoints

#### List Invoices
- **Method**: `GET`
- **Endpoint**: `/invoices`
- **Description**: Get user invoices
- **Query Parameters**: `page`, `limit`, `status`, `date_from`, `date_to`

#### Get Invoice
- **Method**: `GET`
- **Endpoint**: `/invoices/{id}`
- **Description**: Get invoice details

#### Create Invoice
- **Method**: `POST`
- **Endpoint**: `/invoices`
- **Description**: Create new invoice (admin/manager only)

#### Update Invoice
- **Method**: `PUT`
- **Endpoint**: `/invoices/{id}`
- **Description**: Update invoice information

#### List Payments
- **Method**: `GET`
- **Endpoint**: `/payments`
- **Description**: Get payment history
- **Query Parameters**: `page`, `limit`, `status`, `date_from`, `date_to`

#### Process Payment
- **Method**: `POST`
- **Endpoint**: `/payments`
- **Description**: Process new payment

### Communication Endpoints

#### List Messages
- **Method**: `GET`
- **Endpoint**: `/messages`
- **Description**: Get user messages
- **Query Parameters**: `page`, `limit`, `recipient_id`, `channel_id`, `date_from`

#### Send Message
- **Method**: `POST`
- **Endpoint**: `/messages`
- **Description**: Send new message

**Request Body**:
```json
{
  "recipient_id": 2,
  "content": "Hello, how is the project progressing?",
  "message_type": "text"
}
```

#### Get Message
- **Method**: `GET`
- **Endpoint**: `/messages/{id}`
- **Description**: Get message details

#### Mark as Read
- **Method**: `PUT`
- **Endpoint**: `/messages/{id}/read`
- **Description**: Mark message as read

#### List Channels
- **Method**: `GET`
- **Endpoint**: `/channels`
- **Description**: Get available channels

#### Create Channel
- **Method**: `POST`
- **Endpoint**: `/channels`
- **Description**: Create new channel

### Notification Endpoints

#### List Notifications
- **Method**: `GET`
- **Endpoint**: `/notifications`
- **Description**: Get user notifications
- **Query Parameters**: `page`, `limit`, `status`, `type`, `date_from`

#### Get Notification
- **Method**: `GET`
- **Endpoint**: `/notifications/{id}`
- **Description**: Get notification details

#### Mark as Read
- **Method**: `PUT`
- **Endpoint**: `/notifications/{id}/read`
- **Description**: Mark notification as read

#### Update Preferences
- **Method**: `PUT`
- **Endpoint**: `/notifications/preferences`
- **Description**: Update notification preferences

### SaaS Platform Endpoints

#### List Products
- **Method**: `GET`
- **Endpoint**: `/saas/products`
- **Description**: Get available SaaS products

#### Get Product
- **Method**: `GET`
- **Endpoint**: `/saas/products/{id}`
- **Description**: Get product details

#### Subscribe to Product
- **Method**: `POST`
- **Endpoint**: `/saas/products/{id}/subscribe`
- **Description**: Subscribe to SaaS product

#### List Subscriptions
- **Method**: `GET`
- **Endpoint**: `/saas/subscriptions`
- **Description**: Get user subscriptions

#### Cancel Subscription
- **Method**: `DELETE`
- **Endpoint**: `/saas/subscriptions/{id}`
- **Description**: Cancel product subscription

### Developer Platform Endpoints

#### Generate API Key
- **Method**: `POST`
- **Endpoint**: `/developer/keys`
- **Description**: Generate new API key

#### List API Keys
- **Method**: `GET`
- **Endpoint**: `/developer/keys`
- **Description**: Get user API keys

#### Revoke API Key
- **Method**: `DELETE`
- **Endpoint**: `/developer/keys/{id}`
- **Description**: Revoke API key

#### Get Usage Stats
- **Method**: `GET`
- **Endpoint**: `/developer/usage`
- **Description**: Get API usage statistics

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Retry-After: 60
```

### Rate Limit Tiers
- **Free**: 100 requests/hour
- **Basic**: 1000 requests/hour
- **Pro**: 10000 requests/hour
- **Enterprise**: Unlimited

## Error Codes

### Authentication Errors
- `INVALID_CREDENTIALS`: Invalid email or password
- `TOKEN_EXPIRED`: JWT token has expired
- `TOKEN_INVALID`: Invalid JWT token
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

### Validation Errors
- `VALIDATION_ERROR`: Invalid input data
- `MISSING_REQUIRED_FIELD`: Required field is missing
- `INVALID_FORMAT`: Field format is invalid
- `DUPLICATE_ENTRY`: Resource already exists

### Resource Errors
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RESOURCE_CONFLICT`: Resource conflict (e.g., duplicate)
- `RESOURCE_LOCKED`: Resource is currently locked

### System Errors
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded

## Pagination

### Standard Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  }
}
```

### Pagination Parameters
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (e.g., "created_at")
- `order`: Sort order ("asc" or "desc")

## Filtering and Sorting

### Filter Parameters
- `status`: Filter by status (e.g., "active", "completed")
- `date_from`: Filter from date
- `date_to`: Filter to date
- `search`: Text search across relevant fields
- `assigned_to`: Filter by assigned user

### Sort Parameters
- `sort`: Field to sort by
- `order`: Sort direction ("asc" or "desc")

## Webhooks

### Webhook Configuration
- **Method**: `POST`
- **Endpoint**: `/webhooks`
- **Description**: Register webhook endpoint

### Supported Events
- `project.created`
- `project.updated`
- `task.completed`
- `invoice.paid`
- `payment.received`

### Webhook Payload
```json
{
  "event": "project.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "project": {
      "id": 1,
      "name": "New Project",
      "status": "planning"
    }
  }
}
```

## SDKs and Libraries

### Official SDKs
- **JavaScript SDK**: Browser and Node.js support
- **Python SDK**: Python integration
- **PHP SDK**: PHP applications
- **Java SDK**: Enterprise applications

### Code Examples

#### JavaScript
```javascript
const MBTechLabs = require('mbtechlabs-sdk');

const client = new MBTechLabs({
  apiKey: 'your-api-key'
});

// Get projects
const projects = await client.projects.list();
```

#### Python
```python
from mbtechlabs import MBTechLabs

client = MBTechLabs(api_key='your-api-key')

# Get projects
projects = client.projects.list()
```

This API design provides comprehensive access to MB Tech Labs platform functionality while maintaining security, scalability, and ease of use for developers.