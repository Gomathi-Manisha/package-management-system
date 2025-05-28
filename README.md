# 📦 Package Management System

This is a full-stack logistics package management system built with **Spring Boot (Java)** for backend and **Next.js** for frontend.

---

## ✅ Backend Features (Spring Boot)

### 🔐 1. User Authentication
- Register with username, email, password (with hashing)
- Login with JWT token generation
- JWT-based secure login and registration
- Token stored in `localStorage` and attached to protected API requests

### 📦 2. Package Management
- Create, Read, Update, Delete packages
- Fields:
  - Tracking Number (unique, required)
  - Sender Name, Receiver Name
  - Destination
  - Status (`PENDING`, `IN_TRANSIT`, `DELIVERED`)
  - Weight, Dimensions (optional)

### 🔍 3. Search & Filter
- Search by tracking number
- Filter by status

### 📊 4. Reporting
- Summary: total, delivered, pending packages
- Report: all package details

- ### 💻 Responsive UI
- Collapsible sidebar with hamburger menu on mobile
- Theming aligned with UPS branding


---

## 🛠️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Axios
- React Hot Toast
- React Icons

### Backend
- Java 21, Spring Boot
- Spring Security + JWT
- H2 / MySQL DB (dev/prod)
- Maven, Lombok, JPA
- POSTMAN Api
- MYSQL

---

## 🚀 Running Locally

```bash
cd backend/package-management
./mvnw spring-boot:run
