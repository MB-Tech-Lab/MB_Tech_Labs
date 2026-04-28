# 01_System_Architecture.md

# MB Tech Labs - System Architecture

## High-Level Architecture Overview

MB Tech Labs follows a modular, microservices-inspired architecture deployed across multiple hosting environments. The system is designed for scalability, maintainability, and cost-effectiveness while supporting a unified user experience across all platform components.

## Architecture Components

### Frontend Layer
- **Vite + TypeScript Application**: Single-page application serving all user interfaces
- **Modular Component Architecture**: Reusable components across different platform sections
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Backend Layer
- **Django REST API**: Centralized API server handling all business logic
- **Authentication Service**: JWT-based authentication with role-based access control
- **Business Logic Modules**: Separate apps for projects, billing, communication, etc.

### Data Layer
- **MySQL Database**: Primary data storage with optimized schemas
- **File Storage**: Local file system on VPS for user uploads and documents

### Hosting Infrastructure
- **Frontend Hosting**: Vercel for global CDN and serverless deployment
- **Backend Hosting**: Hostinger VPS for API server and database
- **Database Hosting**: MySQL on same VPS as backend for low-latency access

## System Modules

### 1. Public Website Module
- Marketing pages (Home, Services, Portfolio)
- Contact forms and lead generation
- SaaS product showcase
- Authentication integration

### 2. Client Portal Module
- Client-specific dashboard
- Project tracking interface
- Billing and payment views
- Communication tools

### 3. Employee Workspace Module
- Role-based dashboards
- Task management interface
- Time tracking system
- Internal communication

### 4. Admin Dashboard Module
- Business analytics
- User management
- System monitoring
- Configuration controls

### 5. SaaS Platform Module
- Product catalog
- Subscription management
- User product dashboards

### 6. Developer Platform Module
- API key management
- Usage analytics
- Documentation access

## Data Flow Architecture

### User Authentication Flow
1. User submits credentials via frontend
2. Frontend sends request to Django authentication endpoint
3. Django validates credentials against MySQL database
4. JWT token generated and returned to frontend
5. Frontend stores token for subsequent API calls

### Project Management Flow
1. User creates/updates project via frontend
2. Frontend API call to Django project endpoints
3. Django validates permissions and processes request
4. Data stored/retrieved from MySQL database
5. Real-time updates sent to relevant users (polling-based)

### Communication Flow
1. User sends message via frontend
2. Message stored in MySQL database via Django API
3. Polling mechanism checks for new messages
4. Frontend displays new messages to recipients

## Security Architecture

### Authentication & Authorization
- JWT tokens for session management
- Role-based access control (RBAC)
- API key authentication for developer access
- Password hashing with secure algorithms

### Data Protection
- HTTPS encryption for all communications
- Input validation and sanitization
- SQL injection prevention
- File upload security measures

### Network Security
- Firewall configuration on VPS
- Regular security updates
- Access logging and monitoring

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows for multiple backend instances
- Database read replicas for high-traffic scenarios
- CDN integration for static assets

### Performance Optimization
- Database query optimization
- Caching strategies for frequently accessed data
- Lazy loading for frontend components
- API response compression

### Future Scaling Plans
- WebSocket implementation for real-time features
- Microservices migration path
- Cloud migration options (AWS/Azure)

## Deployment Architecture

### Development Environment
- Local development with Docker containers
- Hot reloading for frontend development
- Database migrations for schema updates

### Staging Environment
- VPS-based staging server
- Automated testing pipelines
- Data synchronization with production

### Production Environment
- Vercel for frontend deployment
- Hostinger VPS for backend and database
- Automated deployment scripts
- Backup and recovery procedures

## Monitoring and Logging

### Application Monitoring
- Error tracking and reporting
- Performance metrics collection
- User activity logging
- API usage analytics

### Infrastructure Monitoring
- Server resource monitoring
- Database performance tracking
- Network traffic analysis
- Security incident detection

## Integration Points

### External Services
- Payment gateways (UPI integration)
- Email services for notifications
- File storage services (future consideration)
- Analytics platforms

### Third-Party APIs
- Social login options
- Calendar integrations
- Communication APIs (future video calls)

## Architecture Decision Records

### Decision: Polling over WebSockets (Initial Implementation)
- **Context**: Real-time features needed for communication and notifications
- **Decision**: Implement polling-based system initially
- **Rationale**: Lower infrastructure complexity, easier deployment on VPS
- **Consequences**: Higher server load, slight latency in real-time features

### Decision: Monolithic Django Application
- **Context**: Multiple interconnected modules requiring shared data
- **Decision**: Single Django project with multiple apps
- **Rationale**: Simpler development, easier data consistency
- **Consequences**: Potential scaling challenges, future microservices migration planned

### Decision: MySQL over PostgreSQL
- **Context**: Database selection for relational data
- **Decision**: MySQL for compatibility with Hostinger VPS
- **Rationale**: Native support, performance optimization for VPS environment
- **Consequences**: Some advanced features unavailable, migration path considered

This architecture provides a solid foundation for MB Tech Labs while allowing for future evolution and scaling as the platform grows.