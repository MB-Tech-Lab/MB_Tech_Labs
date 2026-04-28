# 15_Database_Design.md

# MB Tech Labs - Database Design

## Overview

The database design for MB Tech Labs utilizes MySQL as the primary relational database management system. The schema is optimized for the VPS hosting environment and supports all platform components including user management, project tracking, billing, communication, and SaaS product management.

## Database Architecture

### Core Principles
- **Normalization**: Proper data normalization to reduce redundancy
- **Indexing**: Strategic indexing for query performance
- **Relationships**: Foreign key constraints for data integrity
- **Scalability**: Design for future growth and feature expansion
- **Security**: Secure data access and privacy protection

### Database Configuration
- **Engine**: InnoDB for ACID compliance and transaction support
- **Character Set**: UTF-8 for international character support
- **Collation**: utf8_unicode_ci for case-insensitive comparisons
- **Timezone**: UTC for consistent timestamp handling

## Core Tables

### 1. Users Table
**Purpose**: Store user account information and authentication data

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(255),
    role_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id),
    INDEX idx_email (email),
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
);
```

### 2. Roles Table
**Purpose**: Define user roles and their permissions

```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name)
);
```

### 3. Permissions Table
**Purpose**: Store granular permissions for access control

```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_category (category)
);
```

### 4. Role Permissions Table
**Purpose**: Link roles to their assigned permissions

```sql
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    INDEX idx_role (role_id),
    INDEX idx_permission (permission_id)
);
```

### 5. User Roles Table
**Purpose**: Assign roles to users

```sql
CREATE TABLE user_roles (
    user_id INT,
    role_id INT,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    INDEX idx_user (user_id),
    INDEX idx_role (role_id)
);
```

## Project Management Tables

### 6. Projects Table
**Purpose**: Store project information and metadata

```sql
CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    client_id INT,
    project_manager_id INT,
    status ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled') DEFAULT 'planning',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    budget DECIMAL(15,2),
    start_date DATE,
    end_date DATE,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (project_manager_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_client (client_id),
    INDEX idx_manager (project_manager_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority)
);
```

### 7. Tasks Table
**Purpose**: Store individual project tasks

```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT,
    created_by INT,
    status ENUM('todo', 'in_progress', 'in_review', 'completed', 'blocked') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    estimated_hours DECIMAL(6,2),
    actual_hours DECIMAL(6,2) DEFAULT 0.00,
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_project (project_id),
    INDEX idx_assigned (assigned_to),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);
```

### 8. Milestones Table
**Purpose**: Track project milestones and deliverables

```sql
CREATE TABLE milestones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status ENUM('pending', 'in_progress', 'completed', 'delayed') DEFAULT 'pending',
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_project (project_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);
```

## Billing and Financial Tables

### 9. Invoices Table
**Purpose**: Store invoice information and billing data

```sql
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id INT NOT NULL,
    project_id INT,
    status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_client (client_id),
    INDEX idx_project (project_id),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date)
);
```

### 10. Invoice Items Table
**Purpose**: Store individual line items for invoices

```sql
CREATE TABLE invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1.00,
    unit_price DECIMAL(15,2) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    INDEX idx_invoice (invoice_id)
);
```

### 11. Payments Table
**Purpose**: Track payment transactions and records

```sql
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT,
    client_id INT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('upi', 'bank_transfer', 'credit_card', 'cash') NOT NULL,
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    processed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (processed_by) REFERENCES users(id),
    INDEX idx_invoice (invoice_id),
    INDEX idx_client (client_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
);
```

## Communication Tables

### 12. Messages Table
**Purpose**: Store chat messages and communication history

```sql
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT, -- NULL for group messages
    channel_id INT, -- For group channels
    message_type ENUM('text', 'file', 'system') DEFAULT 'text',
    content TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id),
    FOREIGN KEY (channel_id) REFERENCES channels(id),
    INDEX idx_sender (sender_id),
    INDEX idx_recipient (recipient_id),
    INDEX idx_channel (channel_id),
    INDEX idx_created (created_at)
);
```

### 13. Channels Table
**Purpose**: Define communication channels for group messaging

```sql
CREATE TABLE channels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    channel_type ENUM('project', 'team', 'announcement', 'general') DEFAULT 'general',
    project_id INT,
    created_by INT,
    is_private BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_project (project_id),
    INDEX idx_type (channel_type)
);
```

### 14. Channel Members Table
**Purpose**: Manage channel membership

```sql
CREATE TABLE channel_members (
    channel_id INT,
    user_id INT,
    role ENUM('member', 'admin') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (channel_id, user_id),
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_channel (channel_id),
    INDEX idx_user (user_id)
);
```

## SaaS and API Tables

### 15. API Products Table
**Purpose**: Store SaaS product information

```sql
CREATE TABLE api_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    api_endpoint VARCHAR(500),
    version VARCHAR(20) DEFAULT 'v1',
    is_active BOOLEAN DEFAULT TRUE,
    pricing_model ENUM('free', 'freemium', 'paid') DEFAULT 'paid',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_active (is_active)
);
```

### 16. API Keys Table
**Purpose**: Manage API key authentication

```sql
CREATE TABLE api_keys (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100),
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    last_used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES api_products(id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    INDEX idx_key (api_key),
    INDEX idx_active (is_active)
);
```

### 17. API Usage Table
**Purpose**: Track API usage and analytics

```sql
CREATE TABLE api_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    api_key_id INT NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT,
    response_time INT, -- in milliseconds
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
    INDEX idx_key (api_key_id),
    INDEX idx_endpoint (endpoint),
    INDEX idx_created (created_at),
    INDEX idx_status (status_code)
);
```

### 18. Subscriptions Table
**Purpose**: Manage SaaS product subscriptions

```sql
CREATE TABLE subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    plan_name VARCHAR(100),
    status ENUM('trial', 'active', 'suspended', 'cancelled', 'expired') DEFAULT 'trial',
    billing_cycle ENUM('monthly', 'quarterly', 'annual') DEFAULT 'monthly',
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    trial_ends_at TIMESTAMP NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES api_products(id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    INDEX idx_period_end (current_period_end)
);
```

## Notification Tables

### 19. Notifications Table
**Purpose**: Store user notifications and alerts

```sql
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSON,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    channels JSON, -- Array of delivery channels
    status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    sent_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);
```

## Database Optimization

### Indexing Strategy
- **Primary Keys**: Auto-incrementing integer IDs
- **Foreign Keys**: Indexed for join performance
- **Common Queries**: Indexes on frequently filtered columns
- **Composite Indexes**: Multi-column indexes for complex queries

### Performance Considerations
- **Query Optimization**: Efficient SQL query design
- **Connection Pooling**: Database connection management
- **Read Replicas**: Future scalability for read-heavy operations
- **Archiving**: Historical data archiving strategy

### Backup and Recovery
- **Automated Backups**: Daily database backups
- **Point-in-Time Recovery**: Transaction log backups
- **Backup Verification**: Regular backup integrity checks
- **Disaster Recovery**: Off-site backup storage

This database schema provides a solid foundation for MB Tech Labs platform, supporting all core functionality while maintaining scalability and performance for future growth.