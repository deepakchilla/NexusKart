# HiTeckKart - Premium E-Commerce Platform

A production-grade E-Commerce application built with a focus on high-performance architecture, security, and scalability. Designed for SDE interview demonstrations at multi-national corporations (MNCs).

## 🚀 Key Technical Highlights (Interview Specs)

### 1. Robust Security Architecture
*   **Stateful to Stateless Transformation**: Migrated from session-based to **Stateless JWT (JSON Web Token)** authentication.
*   **Spring Security Integration**: Custom `OncePerRequestFilter` to intercept and validate JWT tokens on every REST call.
*   **Password Hashing**: Uses **BCrypt** with a strength factor of 12 for secure user credential storage.
*   **RBAC (Role-Based Access Control)**: Granular permissions for Admins and Customers.

### 2. High-Performance Backend
*   **API Pagination**: Implemented server-side pagination using `Spring Data Pageable` to handle large catalogs without memory overhead.
*   **JPA Entity Relationships**: Engineered complex RDBMS mappings (`OneToMany`, `ManyToOne`) between `Users`, `Products`, `Orders`, and `Reviews`.
*   **Order Management System (OMS)**: Transactional integrity for order placement, including snapshots of product prices and real-time stock reduction.

### 3. Scalable Frontend
*   **Dynamic UI Engine**: Amazon-inspired premium redesign using **Vanilla CSS** and Grid layouts for responsiveness.
*   **Global State Management**: Powered by **React Context API** for seamless cart and user session handling.
*   **Axios Interceptors**: Globally managed API security by automatically attaching JWT tokens to outgoing requests.
*   **Real-time Feedback**: Integrated a dynamic rating system that calculates aggregate scores from global user submissions.

### 4. Quality & Testing
*   **Automated Testing**: Service-layer unit testing using **JUnit 5** and **Mockito** to ensure business logic reliability.
*   **Clean Code**: Adheres to SOLID principles and separation of concerns (Controllers -> Services -> Repositories).

## 🛠 Tech Stack
*   **Backend**: Java 21, Spring Boot 3.3, MySQL, Spring Security, JWT (JJWT).
*   **Frontend**: React.js, React Router 6, Axios, Bootstrap (Utilities), Vanilla CSS.
*   **Tools**: Maven, NPM, Git.

## 📦 Features
*   **Product Discovery**: Category-wise browsing, paginated catalog, and keyword search.
*   **User Experience**: Social reviews with stars, multiple payment method simulations (UPI, Card, COD).
*   **Admin Suite**: Full product management dashboard (Add, Edit, Delete with image handling).
*   **Order History**: Permanent account-linked transaction tracking.
