# Real Estate Listing & Property Booking Management System

A production-grade, enterprise-ready full-stack real estate listing and property booking platform built with **Java 17**, **Spring Boot 3.3.x**, **Spring Security 6**, **JWT Authentication**, **Spring Data JPA**, **Hibernate**, **MySQL 8.0**, and **React**.

---

## 🏛️ System Architecture

```
backend/
├── src/main/java/com/example/realestate/
│   ├── config/            # OpenAPI/Swagger, CORS, JPA Auditing, DataInitializer
│   ├── controller/        # Auth, Property, Booking, Agent, Admin & User REST APIs
│   ├── dto/
│   │   ├── request/       # Validated Request DTOs (Bean Validation)
│   │   └── response/      # Safe Response DTOs (No entity leakage)
│   ├── entity/            # User, Property, PropertyImage, Booking & Enums
│   ├── exception/         # ResourceNotFound, Conflict, DuplicateEmail & GlobalHandler
│   ├── mapper/            # UserMapper, PropertyMapper, BookingMapper
│   ├── repository/        # Spring Data JPA Repositories & PropertySpecification
│   ├── security/          # SecurityConfig, JwtUtils, JwtAuthenticationFilter, UserDetails
│   └── service/           # Auth, User, Property, Booking, Admin Interfaces & Impls
│       └── impl/
└── src/main/resources/
    └── application.properties # MySQL, Port, JWT & Hibernate configuration
```

---

## 👥 Role-Based Access Control (RBAC)

| Role | Permissions & Capabilities |
| :--- | :--- |
| **`CUSTOMER`** | Browse & search properties, view property details, submit visit requests, track personal bookings, cancel pending bookings. |
| **`AGENT`** | Create new property listings, upload image galleries, edit/delete owned listings, view customer visit requests, confirm/reject bookings. |
| **`ADMIN`** | Full system governance: view all users/agents, activate/deactivate accounts, manage all property listings, monitor all site bookings, view analytics. |

---

## 🔐 Pre-Seeded Development Credentials

| Role | Email | Password | Phone |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@propease.in` | `admin123` | +91 98400 00001 |
| **Agent** | `senthil@propease.in` | `agent123` | +91 98401 23456 |
| **Agent** | `kavitha@propease.in` | `agent123` | +91 94432 89012 |
| **Customer** | `dinesh@propease.in` | `customer123` | +91 98765 43210 |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17 or 21** installed (`java -version`)
- **MySQL 8.0** running on `localhost:3306` (or Docker)
- **Node.js 18+ & npm** (for React Frontend)

### 1. Database Setup
Create the MySQL database:
```sql
CREATE DATABASE real_estate_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

*(Note: If using Docker, running `docker-compose up -d` automatically creates and provisions MySQL!)*

### 2. Configure `application.properties`
Check `backend/src/main/resources/application.properties` to match your local MySQL credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/real_estate_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### 3. Build & Run Backend
Navigate to `backend/` directory:
```powershell
cd backend
mvn clean spring-boot:run
```
The backend starts on **`http://localhost:8080`** and auto-initializes the database with sample Tamil Nadu properties, agents, and bookings!

---

## 📖 Swagger API Documentation
Interactive OpenAPI Swagger UI is available at:
👉 **`http://localhost:8080/swagger-ui.html`**

Click **Authorize** and input `Bearer <your_jwt_token>` to test protected agent and admin endpoints directly in the browser!

---

## 🐳 Docker Deployment
To launch both MySQL and the Spring Boot Backend in isolated Docker containers:
```powershell
docker-compose up --build -d
```

---

## 🧪 Running Unit Tests
```powershell
mvn test
```
